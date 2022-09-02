import { getSnDayBounds, getUTCTime, getWeekBounds } from "../../helpers";
import { format } from "date-fns";

export const WeeklySubHeader = ({
    selectedDay, 
    projectMap, 
    dailyEntries
}) => {
    const projects = Array.from(projectMap.values());
    
    // Create array of mappable dates
    const firstDate = getWeekBounds(selectedDay)[0];
    const dateArr = [];
    for(let i=0; i<7; i++){
        dateArr.push(new Date(firstDate));
        firstDate.setDate(firstDate.getDate() + 1);
    }

    return (
        <div className="weekly-subheader week-view-grid">
            <div className="weekly-subheader-title">Projects</div>
            {dateArr.map(date => {
                //Iterate through projectMap to get all timestamps for current day
                let dailyTimestamps = []
                const bounds = getSnDayBounds(date);
                projects.forEach(proj => {    
                    dailyTimestamps = dailyTimestamps.concat(
                        proj.timestamps.filter(stamp => {
                            return stamp.start_time > bounds[0] 
                                && stamp.start_time < bounds[1];
                        })
                    );
                })

                const totalTime = dailyTimestamps.reduce((ms, stamp) => {
                    if(stamp.rounded_duration == '') return ms;
                    return ms + getUTCTime(stamp.rounded_duration).getTime();
                }, 0)

                const totalHours = totalTime / 1000 / 60 / 60;

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