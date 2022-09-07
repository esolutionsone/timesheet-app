import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';
import {
    difference,
    getUTCTime,
    stringifyDuration,
    roundDuration
} from '../helpers';

import WebFont from 'webfontloader';

export const view = (state, { updateState, dispatch }) => {
    const { properties, currentTime } = state;
    const { active, start, projectData, loadFonts, sysId} = properties;
    const isActive = active === "true" || active === true;

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
        const timestampTable = 'x_esg_one_delivery_timestamp';
        if (!isActive) {
            dispatch('INSERT_TIMESTAMP', {
                tableName: timestampTable,
                data: { active: true, project: projectData.sys_id}
            })
        } else {
            // should we call this OPEN_ and CLOSE_TIMESTAMP?
            dispatch('UPDATE_TIMESTAMP', {
                tableName: timestampTable,
                sys_id: sysId,
                data: { active: false }
            });
        }
    }

    return (
        <Fragment>
            <div className="timer-button-container">
                <span className={"btn-circle btn-active "  + (isActive && 'active')}>
                    <span className={"material-symbols-outlined"} on-click={timerStart}>
                        {isActive ? 'pause' : 'play_arrow'} 
                    </span>
                </span>

                <span className={'timer-counter ' + (isActive ? 'display-active' : 'display-inactive')}>
                    {timerDisplayValue || 'Start'}
                </span>
                
                <span className='display-rounded'>
                    {stringifyDuration(roundedDuration).slice(0, -3)}
                </span>
            </div>
        </Fragment>
    );
};