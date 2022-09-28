import { getUTCTime } from "../../helpers";

export const enforceMinMax = (e) => {
    // Clamp to 24 hour max
    if (e.target.value > 24) {
        e.target.value = 24;
    }
}

export const getTimestampHours = (timestamps) => {
    // set the timestamp hours for the project if they exist
    let timestampHours = 0
    if (timestamps) {
        timestampHours = timestamps
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

    return timestampHours;
}

export const getTimeAdjustment = (entry) => {
    // Add time adjustment from timeEntry
    let timeAdjustment = 0;
    if (entry) {
        if (entry.time_adjustment) {
            timeAdjustment = getUTCTime(entry.time_adjustment).getTime();
        }
        timeAdjustment = timeAdjustment / 1000 / 60 / 60;
        timeAdjustment *= (entry.adjustment_direction == 'add')
            ? 1 : -1;
    }
    return timeAdjustment;
}

export const getNoteValue = (entry) => {
    if(!entry || !entry.note) return '';
    return entry.note;
}

