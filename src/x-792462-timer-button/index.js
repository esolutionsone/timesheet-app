import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import {createHttpEffect} from '@servicenow/ui-effect-http';
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
        updateState({currentTime: new Date()});
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
		currentTime: null,
		loadTime: null,
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamps"}
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: ({updateState}) => updateState({loadTime: new Date()}), // replace with REST
		'NOW_BUTTON#CLICKED': ({action, dispatch, state}) => {
			console.log('clicked');
			dispatch('TIMER_BUTTON#CLICKED', state);
			dispatch('INSERT_TIMESTAMP');
			console.log('both actions dispatched');
		},
		'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
		'INSERT_TIMESTAMP': ({properties}) => createHttpEffect(`api/now/table/${properties.timestampTable}`, {
			method: 'POST',
			dataParam: {timestamp: new Date()},
			onStartActionType: 'INSERT_START',
			onSuccessAction: 'INSERT_SUCCESS',
			onErrorAction: 'INSERT_ERROR',
		}),
		'INSERT_START': () => console.log('REST called'),
		'INSERT_SUCCESS': ({action}) => console.log(action.payload),
		'INSERT_ERROR': ({action}) => console.log(action.payload),
	}
});
