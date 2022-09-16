import { getSnDayBounds, getUTCTime, getWeekBounds } from "../../helpers";
import { format } from "date-fns";

export const WeeklySubHeader = ({
    selectedDay, 
    // dailyEntries,
    dateArr,
    entries,
    timestamps
}) => {
    console.log(timestamps)
    console.log(entries);
    // const projects = Array.from(projectMap.values());


    return (
        <div className="weekly-subheader week-view-grid">
            <div className="weekly-subheader-title">Projects</div>
            {dateArr.map(date => {
                // Filter timestamps by day
                const bounds = getSnDayBounds(date);
                let dailyTimestamps = timestamps.filter(stamp => {
                    return stamp.start_time > bounds[0] 
                        && stamp.start_time < bounds[1];
                })

                console.log('TIMESTMAPS', dailyTimestamps)
                // projects.forEach(proj => {  
                //     if(proj.timestamps){
                //         dailyTimestamps = dailyTimestamps.concat(
                //             proj.timestamps.filter(stamp => {
                //                 return stamp.start_time > bounds[0] 
                //                     && stamp.start_time < bounds[1];
                //             })
                //         );
                //     }  
                // })

                const totalTime = dailyTimestamps.reduce((ms, stamp) => {
                    if(stamp.rounded_duration == '') return ms;
                    return ms + getUTCTime(stamp.rounded_duration).getTime();
                }, 0)

                // The following code theoretically works,
                // but we'll have to adjust how we handle weekly time input and negative values
                           
                const timeEntries = entries.filter(entry => {
                    return entry.date == bounds[0].split(' ')[0]
                        && entry.time_adjustment.length > 0;
                })

                const adjustmentMs = timeEntries.reduce((ms, entry) => {
                    return ms + getUTCTime(entry.time_adjustment).getTime();
                }, 0);

                const totalHours = (totalTime + adjustmentMs) / 1000 / 60 / 60;

                return <div>
                        <div>{format(date, 'MMM dd')}</div>
                        <div>{format(date, 'E')}</div>
                        <div 
                            className={`weekday-hours ${totalHours == 0 && 'weekday-hours-zero'}`}
                        >
                            {totalHours}
                        </div>
                        {/* <div>{JSON.stringify(dailyTimestamps, null, 2)}</div> */}
                    </div>
            })}
        </div>
    );
}