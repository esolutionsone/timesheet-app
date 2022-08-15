import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import {snabbdom, Fragment} from '@servicenow/ui-renderer-snabbdom';
// import '@servicenow/now-button';
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

const view = (state, {updateState, dispatch}) => {
	const {seconds, loadTime, currentTime} = state;
	const isActive = state.timerActive;
	const styles = {
		color: state.timerActive ? 'green' : 'red'
	}

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

	console.log('renders correctly')


	return (
		<Fragment>
		{/* <button on-click={() => dispatch('TEST_GET', {
			table_name: 'x_esg_one_delivery_timestamps',
			sysparm_limit: '10', 
			sysparm_query: 'active=true',
		})}>{difference(currentTime, loadTime)}</button> */}
		<button 
		style={styles}
		on-click={() => {
			updateState({timerActive: !state.timerActive});
		// 	dispatch('INSERT_TIMESTAMP', {
		// 	short_description: 'test'
		// })
	}
		}>{difference(currentTime, loadTime)}</button>
		</Fragment>
	);
};

createCustomElement('x-792462-timer-button', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		timerActive: false,
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
			dispatch('INSERT_TIMESTAMP', {short_description: 'test'});
			dispatch('TEST_GET');
			console.log('both actions dispatched');
		},
		'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
		'INSERT_TIMESTAMP': createHttpEffect(`api/now/table/x_esg_one_delivery_timestamps`, {
			method: 'POST',
			dataParam: 'data',
			headers: {},
			startActionType: 'INSERT_START',
			successActionType: 'INSERT_SUCCESS',
			errorActionType: 'INSERT_ERROR',
		}),
		'INSERT_START': ({host}) => console.log('REST called', host),
		'INSERT_SUCCESS': ({action}) => console.log(action.payload),
		'INSERT_ERROR': ({action}) => console.log(action.payload),
		'TEST_GET': createHttpEffect(`api/now/table/:table_name`, {
				pathParams: ['table_name'],
				method: 'GET',
				queryParams: ['sysparm_limit'],
				startActionType: 'TEST_START',
				successActionType: 'INSERT_SUCCESS',

			}),
		'TEST_START': () => console.log('test start'),
	}
});
