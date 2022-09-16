import { getSnDayBounds, getUTCTime, getWeekBounds } from "../../helpers";
import { format } from "date-fns";

export const WeeklySubHeader = ({
    selectedDay,
    dateArr,
    entries,
    timestamps
}) => {
    return (
        <div className="weekly-subheader week-view-grid">
            <div className="weekly-subheader-title">Projects</div>

            { // For each day of the week:
            dateArr.map(date => {

                // Filter timestamps by day
                const bounds = getSnDayBounds(date);
                let dailyTimestamps = timestamps.filter(stamp => {
                    return stamp.start_time > bounds[0] 
                        && stamp.start_time < bounds[1];
                })

                // Add the ms for all the daily timestamps
                const totalTime = dailyTimestamps.reduce((ms, stamp) => {
                    if(stamp.rounded_duration == '') return ms;
                    return ms + getUTCTime(stamp.rounded_duration).getTime();
                }, 0)

                // Filter the entries by day
                const timeEntries = entries.filter(entry => {
                    return entry.date == bounds[0].split(' ')[0]
                        && entry.time_adjustment.length > 0;
                })

                // Add the ms for all the daily entries
                const adjustmentMs = timeEntries.reduce((ms, entry) => {
                    return ms + getUTCTime(entry.time_adjustment).getTime();
                }, 0);

                // Convert to hours
                const totalHours = (totalTime + adjustmentMs) / 1000 / 60 / 60;

                return <div>
                        <div>{format(date, 'MMM dd')}</div>
                        <div>{format(date, 'E')}</div>
                        <div 
                            className={`weekday-hours ${totalHours == 0 && 'weekday-hours-zero'}`}
                        >
                            {totalHours}
                        </div>
                    </div>
            })}
        </div>
    );
}