import { differenceInMilliseconds, intervalToDuration } from 'date-fns';

export const difference = (current, load) => {
	if(!current || !load) return '00:00:00';
	let duration = intervalToDuration({
		start: 0,
		end: differenceInMilliseconds(current, load) || 0,
	});

	// coerce to strings and pad to get hh:mm:ss format
	for (let el in duration){
		duration[el] = duration[el].toString().padStart(2, '0');
	}

	let {hours, minutes, seconds} = duration;

	// get rounded Hours and Minutes
	let totalSeconds = hours * 3600 + minutes * 60 + Number(seconds);
	let totalMinutes = Math.ceil(totalSeconds / 60 / 15) * 15;
	let roundedHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
	let roundedMinutes = ((totalMinutes % 60)).toString().padStart(2, '0');

	return `${hours}:${minutes}:${seconds} - ${roundedHours}:${roundedMinutes}:00`;
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