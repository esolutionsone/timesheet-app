import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon'
import {
    difference,
    getUTCTime,
    stringifyDuration,
    roundDuration
} from './helpers';

export const view = (state, { updateState, dispatch }) => {
    const { properties, currentTime } = state;
    const { active, start } = properties;
    const style = { color: active == "true" ? 'green' : 'red' };
    const isActive = active === "true";


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
                data: { active: true }
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

    return (
        <Fragment>
            <div className="timer-container">
                <span className={isActive ? 'display-active' : 'display-inactive'}>
                    {timerDisplayValue || 'Start'}
                </span>
                <span className='display-rounded'>
                    {stringifyDuration(roundedDuration)}
                </span>
                {/* <button
                    style={style}
                    on-click={timerStart}></button> */}
                <now-icon
                    on-click={timerStart} 
                    icon="circle-play-outline" 
                    className={isActive ? 'display-active' : 'display-inactive'} size="lg"></now-icon>
            </div>
        </Fragment>
    );
};