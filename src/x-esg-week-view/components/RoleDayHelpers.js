import { getUTCTime } from "../../helpers";

/**
 * Clamps input values to range 0-24 inclusive
 * @param {Event} e 
 */
export const enforceMinMax = (e) => {
    if (e.target.value > 24) {
        e.target.value = 24;
    }
}

export const getTimestampHours = (timestamps, date) => {
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

/**
 * Takes in the daily entry and hours, returns true if note is missing
 * and hours are not zero
 * @param {} entry 
 * @param {number} hours 
 * @returns boolean
 */
export const isMissingNote = (entry, hours) => {
    // Check for entry, non-zero hours, and lack of note
    if(!entry) return false;
    if(hours === 0)return false;
    if(entry.note) return false;
    return true;
}