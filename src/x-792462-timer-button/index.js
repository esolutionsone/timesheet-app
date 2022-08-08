import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-button';
import styles from './styles.scss';
import { differenceInMilliseconds, intervalToDuration } from 'date-fns';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

const difference = (current, load) => {
	let duration = intervalToDuration({
		start: 0,
		end: differenceInMilliseconds(current, load) || 0,
	});


	let {hours, minutes, seconds} = duration;

	const leadZeroString = (num) => {
		num = num.toString();
		if(num.length == 1){
			return '0' + num;
		}else{
			return num;
		}
	}
	return `${leadZeroString(hours)}:${leadZeroString(minutes)}:${leadZeroString(seconds)}`;
}

const view = (state, {updateState}) => {
	const {seconds, loadTime, currentTime} = state;
	const isActive = true;

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
		currentTime: 'init',
		loadTime: 'init',
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: ({updateState}) => updateState({loadTime: new Date()}),
		'NOW_BUTTON#CLICKED': ({action}) => console.log('clicked'),
		'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
	}
});
