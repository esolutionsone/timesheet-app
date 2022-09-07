import WebFont from 'webfontloader';
import { getWeekBounds } from '../../helpers';
import { dateFormatter } from '../../constants'
import {format} from 'date-fns'
import { FETCH_TIME_ENTRIES_PAYLOAD } from '../../payloads';


export const WeeklyHeader = ({selectedDay, updateState, dispatch}) => {

    const startDay = format(getWeekBounds(selectedDay)[0], 'MMM dd')
    const endDay = format(getWeekBounds(selectedDay)[1], 'MMM dd, Y')

    const handleWeekSelect = (forward) => {
        const increment = forward ? 7 : -7;

        updateState({
            selectedDay: new Date(selectedDay.setDate(selectedDay.getDate() + increment))
        })
        dispatch('WEEK_REFETCH');

    }

    return (
        <div className="weekly-header">
            <div className="weekly-left-right-buttons">
                <button className="chevron-left" on-click={() => handleWeekSelect(false)}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="chevron-right" on-click={() => handleWeekSelect(true)}>
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <div className="weekly-date-start">Week of</div>
            <div className="weekly-date-end">{startDay} to {endDay}</div>
        </div>
    );
}