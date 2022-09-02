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
        console.error('Cannot transform datestring of type', typeof(dateString), '\ndate: ', dateString);
        return new Date();
    } 
    const arr = dateString.split(/[\-\s:]/g);
    arr[1] = arr[1] - 1;
    return new Date(Date.UTC(...arr));
}


/**
 * Accepts millisecond duration and outputs string in "HH:MM" format
 * @param {number} ms 
 * @returns 
 */
export const msToString = (ms) => {
    let totalMinutes = ms / 1000 / 60;
    let hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    let minutes = Math.floor(totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

// /**
//  * Takes in a string in 'hh:mm' format and returns a 
//  * SN time representation of that time converted to UTC
//  * @param {string} hoursAndMinutes 
//  * @returns 
//  */
// export const hhmmToSnTime = (hoursAndMinutes) => {
//     // get correct UTC date
//     const today = new Date();
//     const [hours, minutes] = hoursAndMinutes.split(':');

//     const localDate = new Date(today.setHours(hours,minutes));


//     const obj = {
//         utcYear: localDate.getUTCFullYear(),
//         utcMonth: localDate.getUTCMonth() + 1,
//         utcDay:localDate.getUTCDate(),
//         utcHour:localDate.getUTCHours(),
//         utcMinutes:localDate.getUTCMinutes(),
//     }

//     for(let el in obj){
//         obj[el] = obj[el].toString().padStart(2,'0');
//     }
//     const {utcYear, utcMonth, utcDay, utcHour, utcMinutes} = obj;
//     return `${utcYear}-${utcMonth}-${utcDay} ${utcHour}:${utcMinutes}:00`;
// }

/**
 * Takes in a string in 'hh:mm' format and returns a 
 * SN time representation of that time converted to UTC
 * @param {string} hoursAndMinutes 
 * @returns 
 */
 export const hhmmToSnTime = (hoursAndMinutes) => {
    // get correct UTC date
    const today = new Date();
    const [hours, minutes] = hoursAndMinutes.split(':');
    const localDate = new Date(today.setHours(hours,minutes));

    return toSnTime(localDate);
}

/**
 * Convert Javascript Date to ServiceNow Datetime
 * @param {Date} date Javascript Date object
 * @returns ServiceNow DateTime in UTC
 */
export const toSnTime = (date) => {
    const obj = {
        utcYear: date.getUTCFullYear(),
        utcMonth: date.getUTCMonth() + 1,
        utcDay:date.getUTCDate(),
        utcHour:date.getUTCHours(),
        utcMinutes:date.getUTCMinutes(),
    }

    for(let el in obj){
        obj[el] = obj[el].toString().padStart(2,'0');
    }

    const {utcYear, utcMonth, utcDay, utcHour, utcMinutes} = obj;
    return `${utcYear}-${utcMonth}-${utcDay} ${utcHour}:${utcMinutes}:00`;
}

/**
 * Accepts javascript date object and returns two SN datetime strings,
 * representing the start and end bounds of the date.
 * @param {Date} date 
 * @returns {Array} Array in format [startDate, endDate] in SN Date format (UTC)
 */
export const getSnDayBounds = (date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);
    const startTime = toSnTime(new Date(startDate.setHours(0,0,0,0)));
    const endTime = toSnTime(new Date(endDate.setHours(24,0,0,0)));
    return [startTime, endTime];
}

export const getSnWeekBounds = (date) => {
    const dayOfWeek = date.getDay();
    const toMon = 1 - dayOfWeek;
    let toSun = 7 - dayOfWeek;
    if(toSun == -7) toSun = 0; // handle when .getDay() returns 0;

    const startDate = new Date(date);
    const endDate = new Date(date);
    const startTime = toSnTime(addDaysSetHours(startDate, toMon, false));
    const endTime = toSnTime(addDaysSetHours(endDate, toSun, true));
    return [startTime, endTime];
}

function addDaysSetHours(date, days, end) {
    const hours = end ? 24 : 0;
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days,
        hours,
        0,
        0,
        0
    );
}

export const buildProjectMap = (timestamps) => {
        const stampsByProject = new Map();
        
        // Massage for easy mapping
        // Subtracting the parsed ServiceNow zero duration time with 
        // Date.parse("1970-01-01 00:00:00") corrects for timezone issues, etc.
        for(let stamp of timestamps){
            const projectId = stamp['project.sys_id'];
            const active = stamp.active === 'true';

            const sharedValues = {
                active,
                sys_id: projectId,
                note: stamp.note,
                client: stamp['project.client.short_description'],
                ["client.sys_id"]: stamp['project.client.sys_id'],
                short_description: stamp['project.short_description'],
            }
            if(stampsByProject.has(projectId)){
                stampsByProject.set(projectId, {
                    ...sharedValues,
                    timestamps: [stamp, ...stampsByProject.get(projectId).timestamps],
                    totalRoundedTime: stampsByProject.get(projectId).totalRoundedTime + 
                        (Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") 
                        || 0),
                });
            } else{
                stampsByProject.set(projectId, {
                    ...sharedValues,
                    timestamps: [stamp],
                    totalRoundedTime: Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") || 0,
                })
            }
        }
        return stampsByProject;
}