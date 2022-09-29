import WebFont from 'webfontloader';
import { getWeekBounds } from '../../helpers';
import { dateFormatter } from '../../constants'
import { format } from 'date-fns'
import { FETCH_TIME_ENTRIES_PAYLOAD } from '../../payloads';


export const WeeklyHeader = ({ selectedDay, updateState, dispatch }) => {

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
            <div className='time-box'>
                <div>Time increments are logged in quarters.</div>
                <div className='time-box-increments'>
                    <div>.25 = 15 min</div>
                    <div>.50 = 30 min</div>
                    <div>.75 = 45 min</div>
                </div>
            </div>
            <div className="help-info">
                <span className="material-symbols-outlined help-icon">
                    help
                </span>
                <div className="help-text">
                    <ul>
                        <li>Times logged without work notes show up with a red outline.</li>
                        <li>Pressing Tab or Shift+Tab moves the focus horizontally.</li>
                        <li>Pressing Ctrl/Command+Enter or Ctrl/Command+Shift+Enter moves the focus vertically.</li>
                        <li>When entering times, up/down arrow keys add/subtract increments of a quarter-hour.</li>
                        <li>Valid inputs must be multiples of 0.25 (otherwise, they are rounded to the closest valid value).</li>
                        <li>Timesheets can be recalled and until they are marked as 'invoiced' by the supervisor.</li>
                        <li>Timesheets for future weeks cannot be edited ahead of time.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}