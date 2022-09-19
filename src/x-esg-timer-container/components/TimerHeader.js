import { msToString, hhmmToSnTime, getSnDayBounds } from '../../helpers';
import { format, formatDistanceToNow, isToday } from 'date-fns';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../../payloads';

export const TimerHeader = ({consultantId, dispatch, updateState, projectMap, selectedDay, addProjectStatus}) => {

     /**
     * Increments state.selectedDay 1 day forward or backward
     * @param {bool} forward 
     */
      const incrementDate = (forward) => {
        dispatch('UPDATE_ADD_PROJECT')
        // Calculate 1 day forward/backward
        let increment = 24 * 60 * 60 * 1000 * (forward ? 1: -1);

        let d = new Date(selectedDay.getTime() + increment)
        updateState({selectedDay: d});
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(d)
            )
        );
    }

    // Calculate the total rounded time from the timestamps in projectMap
    let totalTime = Array.from(projectMap.values()).reduce((sum, val) => sum += val.totalRoundedTime, 0);
    totalTime = msToString(totalTime);

    // Determine message for today-header
    let howLongAgo = "Today";
    const dayStart = new Date().setHours(0,0,0,0);
    if(selectedDay < dayStart){
        howLongAgo = formatDistanceToNow(selectedDay) + ' ago';
    }

    return (
        <div className="today-header">
            <span className="title">{howLongAgo}</span>
            <span className="header-date">
                <span className="material-symbols-outlined date-chevron"
                    on-click={() => incrementDate(false)}>
                    chevron_left
                </span>
                <span>{format(selectedDay, 'E MMM d, Y')}</span>
                <span className={`material-symbols-outlined 
                        date-chevron 
                        ${isToday(selectedDay) && ' disabled'}`
                    }
                    on-click={() => !isToday(selectedDay) && incrementDate(true)}
                >
                    chevron_right
                </span>
            </span>
            <div className="today-total">
                <span>Total </span>
                <span className="project-time"> {totalTime}</span>
            </div>
        </div>
    );
}