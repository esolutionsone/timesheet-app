import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-button';
import styles from './styles.scss';
import { differenceInMilliseconds, intervalToDuration, parseISO } from 'date-fns';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

const difference = (current, load) => {
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
	return `${hours}:${minutes}:${seconds}`;
}

const view = (state, {updateState}) => {
	const {seconds, loadTime, currentTime} = state;
	const isActive = true;

	// Update every second
	let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        updateState({seconds: seconds + 1, currentTime: new Date()});
		clearInterval(interval);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

	return (
		<now-button>{difference(currentTime, loadTime)}</now-button>
	);
};

createCustomElement('x-792462-timer-button', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		previousTime: 0,
		seconds: 0,
		currentTime: null,
		loadTime: null,
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: ({updateState}) => updateState({loadTime: new Date()}), // replace with REST
		'NOW_BUTTON#CLICKED': ({action, dispatch, state}) => {
			console.log('clicked');
			dispatch('TIMER_BUTTON#CLICKED', state);
			
		},
		'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
	}
});
