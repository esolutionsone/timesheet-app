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

/**
 * Allows users to cmd/ctrl (+ shift)) + enter to navigate columns
 * @param {KeyboardEvent} e Keyboard event
 * @param {string} date string date corresponding to the column
 * @param {string[]} path Array of strings representing path to the focus target
 */
export const moveVerticalFocus = (e, date, path) => {
    if((e.metaKey || e.ctrlKey) && e.key === 'Enter'){
        // Go backwards (up) if holding the shift key
        const increment = e.shiftKey ? -1 : 1;

        // Find the parent of the 'table'
        const weekContainer = e.path.find(node => {
            return Array.from(node.classList).includes('week-container');
        })

        // Query for all inputs for the given date
        const column = weekContainer.querySelectorAll(`[data-date="${date}"]`);

        // Set current element data so we can track current position
        let target = e.target;
        if(path){
            path.forEach(key => {
                target = target[key]
            });
        }
        target.dataset.focused = true;

        // Check each element in the column to find current,
        // then increment and focus
        for(let i=0; i<column.length; i++){
            const el = column[i];
            if(el.dataset.focused === "true"){
                let newIndex;
                if(i + increment > column.length - 1){
                    newIndex = 0;
                }else if(i + increment < 0){
                    newIndex = column.length - 1
                }else{
                    newIndex = i + increment;
                }
                column[newIndex].focus();
            }
            column[i].dataset.focused = false;
        }
    }
}