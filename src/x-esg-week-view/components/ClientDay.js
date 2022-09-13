import { format } from "date-fns";
import { getUTCTime, stringifyDuration } from "../../helpers";

const ClientDay = ({ project, day, dispatch, consultantId }) => {
    const date = format(day, 'Y-MM-dd')
    const todayEntry = project.time_entries ?
        project.time_entries
            .find(e => e.date == date)
        :
        null;

    const handleBlur = (e, timestampHours = 0, todayEntry) => {
        let inputHours = 0;
        if (e.target.value) {
            inputHours = Number(e.target.value);
        }
        const difference = inputHours - timestampHours;
        const differenceDur = {
            hours: Math.abs(Math.floor(difference)),
            minutes: Math.abs(Math.floor(60 * (difference % 1)))
        }

        const adjustment_direction = difference >= 0 ? 'add' : 'subtract';
        const stringDuration = "1970-01-01 " + stringifyDuration(differenceDur);

        if (todayEntry) {
            dispatch('UPDATE_TIME_ENTRY', {
                data: {
                    time_adjustment: stringDuration,
                    adjustment_direction,
                },
                sys_id: todayEntry.sys_id,
            })
        } else {
            const data = {
                adjustment_direction,
                time_adjustment: stringDuration,
                date: day,
                project: project.sys_id,
                consultant: consultantId,
            };
            dispatch('INSERT_TIME_ENTRY', { data })
        }
    }

    if (!todayEntry && !project.timestamps) {
        return <input
            on-blur={(e) => handleBlur(e)}
            className="project-item-time" type="number" />
    } else {
        // set the timestamp hours for the project if they exist
        let timestampHours = 0
        if (project.timestamps) {
            timestampHours = project.timestamps
                //filter by stamps matching date
                .filter(stamp => {
                    return stamp.rounded_duration !== ''
                        && stamp.start_time.split(' ')[0] == date;
                })
                // reduce on time, and convert to hours
                .reduce((acc, stamp) => {
                    return acc + getUTCTime(stamp.rounded_duration).getTime();
                }, 0) / 1000 / 60 / 60;
        }

        // Add time adjustment from timeEntry
        let timeAdjustment = 0;
        if (todayEntry) {
            if(todayEntry.time_adjustment){
                timeAdjustment = getUTCTime(todayEntry.time_adjustment).getTime();
            }
            timeAdjustment = timeAdjustment / 1000 / 60 / 60;
            timeAdjustment *= (todayEntry.adjustment_direction == 'add')
                ? 1 : -1;
        }
        return <input
            className="project-item-time"
            type="number"
            value={timestampHours + timeAdjustment}
            on-blur={(e) => handleBlur(e, timestampHours, todayEntry)}
        />
    }
}

export default ClientDay;