// import { differenceInMilliseconds, intervalToDuration} from 'date-fns';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import intervalToDuration from 'date-fns/intervalToDuration';

/**
 * Accepts two dates and returns the difference between them as a duration object.
 * @param {Date} current Date object
 * @param {Date} initial Date object (prior to first date object)
 * @returns {{
 * years: string, 
 * hours: string, 
 * days: string,
 * minutes: string, 
 * seconds: string
 * }}
 */
export const difference = (current, initial) => {
	let duration = intervalToDuration({
		start: 0,
		end: differenceInMilliseconds(current, initial) || 0,
	});
    return duration;
}

/**
 * Accepts a duration object and returns an object rounded up to next 15 minutes.
 * @param {duration} duration 
 * @returns {duration} duration rounded to 15 minutes
 */
export const roundDuration = (duration) => {
    const {hours, minutes, seconds} = duration;

    // get rounded Hours and Minutes
	let totalSeconds = hours * 3600 + minutes * 60 + Number(seconds);
	let totalMinutes = Math.ceil(totalSeconds / 60 / 15) * 15;
	let roundedHours = Math.floor(totalMinutes / 60);
	let roundedMinutes = ((totalMinutes % 60));

    return {hours: roundedHours, minutes: roundedMinutes, seconds: 0};
}

/**
 * Accepts a duration object and returns a str
 * @param {{hours: number, minutes: number, seconds: number}} duration 
 * @returns string in hH:MM:SS format
 */
export const stringifyDuration = (duration) => {
    let {hours, minutes, seconds} = duration;

    // coerce to strings and pad to get hh:mm:ss format
    const result = { hours, minutes, seconds };
    for (let el in result){
		result[el] = result[el].toString().padStart(2, '0');
	}
    return `${result.hours || '00'}:${result.minutes || '00'}:${result.seconds || '00'}`;
}

/**
 * Accepts a string date in ServiceNow display format 'yyyy-MM-DD HH:MM:SS', 
 * and converts it to a date object, 
 * @param {string} dateString UTC datestring in 'yyyy-MM-DD HH:MM:SS' format
 * @returns {Date} Date object
 */
export const getUTCTime = (dateString) => {
    if(!dateString){
        console.error('Cannot transform datestring of type', typeof(dateString))
        return;
    } 
    const arr = dateString.split(/[\-\s:]/g);
    arr[1] = arr[1] - 1;
    return new Date(Date.UTC(...arr));
}

export const msToString = (ms) => {
    let totalMinutes = ms / 1000 / 60;
    let hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    let minutes = Math.floor(totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}