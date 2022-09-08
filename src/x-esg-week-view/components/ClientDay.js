import { format } from "date-fns";
import { getUTCTime, stringifyDuration } from "../../helpers";

const ClientDay = ({ project, day, dispatch, consultantId }) => {
    const date = format(day, 'Y-MM-dd')
    const todayEntry = project.time_entries ?
        project.time_entries
            .find(e => e.date == date)
        :
        null;

    const handleBlur = (e, timestampHours, todayEntry) => {
        const inputHours = Number(e.target.value);
        const difference = inputHours - timestampHours;

        const adjustment_direction = difference >= 0 ? 'add' : 'subtract';
        const stringDuration = "1970-01-01 " + stringifyDuration({ hours: Math.abs(difference) });

        if (todayEntry) {
            dispatch('UPDATE_TIME_ENTRY', {
                data: {
                    time_adjustment: stringDuration,
                    adjustment_direction,
                },
                sys_id: todayEntry.sys_id,
            })
        } else {
            dispatch('INSERT_TIME_ENTRY', {
                data: {
                    adjustment_direction,
                    time_adjustment: stringDuration,
                    date: day,
                    project: project.sys_id,
                    consultant: consultantId,
                },
            })
        }
    }

    console.log('date:', date, 'todayEntry', todayEntry)
    if (!todayEntry && !project.timestamps) {
        return <input className="project-item-time" type="number" />
    } else {
        console.log('FOUND ONE')
        console.log(project.timestamps)
        const timestampHours = project.timestamps
            .filter(stamp => {
                return stamp.rounded_duration !== ''
                    && stamp.start_time.split(' ')[0] == date;
            })
            .reduce((acc, stamp) => {
                return acc + getUTCTime(stamp.rounded_duration).getTime();
            }, 0) / 1000 / 60 / 60;

        // Add time adjustment from timeEntry
        let timeAdjustment = 0;
        if (todayEntry) {
            timeAdjustment = getUTCTime(todayEntry.time_adjustment).getTime();
            timeAdjustment = timeAdjustment / 1000 / 60 / 60;
            timeAdjustment *= todayEntry.adjustment_direction == 'add'
                ? 1 : -1;
        }
        console.log('timeAdjustment', timeAdjustment);
        return <input
            className="project-item-time"
            type="number"
            value={timestampHours + timeAdjustment}
            on-blur={(e) => handleBlur(e, timestampHours, todayEntry)}
        />
    }
}

export default ClientDay;