import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';
import {
    difference,
    getUTCTime,
    stringifyDuration,
    roundDuration
} from './helpers';

import WebFont from 'webfontloader';

export const view = (state, { updateState, dispatch }) => {
    const { properties, currentTime } = state;
    const { active, start, projectData, loadFonts } = properties;
    const style = { color: active == "true" ? 'green' : 'red' };
    const isActive = active === "true";

    // Load Custom Fonts
    if(loadFonts) WebFont.load({
        google: {
            families: ['Montserrat:400,600', 'Material+Symbols+Outlined']
        }
    });

    // Update every second
    let interval = null;
    if (isActive) {
        interval = setInterval(() => {
            updateState({ currentTime: new Date() });
            clearInterval(interval);
        }, 1000);
    } else if (!isActive) {
        clearInterval(interval);
    }

    const timerDuration = start ? difference(currentTime, getUTCTime(start))
        : { hours: 0, minutes: 0, seconds: 0 };
    const roundedDuration = roundDuration(timerDuration);
    const timerDisplayValue = stringifyDuration(timerDuration);

    const timerStart = () => {
        const { timestampTable } = properties;
        if (!isActive) {
            dispatch('INSERT_TIMESTAMP', {
                timestampTable,
                data: { active: true, project: projectData.sys_id}
            })
        } else {
            // should we call this OPEN_ and CLOSE_TIMESTAMP?
            dispatch('UPDATE_TIMESTAMP', {
                timestampTable,
                sys_id: properties.sysId,
                data: { active: false }
            });
        }
    }

    console.log(projectData)

    return (
        <Fragment>
            
            <div className="timer-container">
       
                <div className="pill">
                    {projectData.short_description || 'Project Name / Details'}
                </div>
                
                <div className="timer-items-right">
                    <div>
                        <div className="pill">Today</div>
                    </div>
                    
                    <span className={'timer-counter ' + isActive ? 'display-active' : 'display-inactive'}>
                        {timerDisplayValue || 'Start'}
                    </span>
                    
                    <span className='display-rounded'>
                        {stringifyDuration(roundedDuration).slice(0, -3)}
                    </span>
                    
                    <span className={"btn-circle btn-active "  + (isActive && 'active')}>
                        <span className={"material-symbols-outlined"} on-click={timerStart}>
                            {/* {isActive ? 'stop' : 'play_arrow'}  */}
                            play_arrow
                        </span>
                    </span>
                </div>
            </div>
        </Fragment>
    );
};