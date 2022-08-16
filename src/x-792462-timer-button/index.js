import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import {snabbdom, Fragment} from '@servicenow/ui-renderer-snabbdom';
// import '@servicenow/now-button';
import styles from './styles.scss';
import { differenceInMilliseconds, intervalToDuration } from 'date-fns';

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

	// get rounded Hours and Minutes
	let totalSeconds = hours * 3600 + minutes * 60 + Number(seconds);
	let totalMinutes = Math.ceil(totalSeconds / 60 / 15) * 15;
	let roundedHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
	let roundedMinutes = ((totalMinutes % 60)).toString().padStart(2, '0');

	return `${hours}:${minutes}:${seconds} - ${roundedHours}:${roundedMinutes}:00`;
}

const view = (state, {updateState, dispatch }) => {
	const {properties, seconds, currentTime} = state;
	const { active, start } = properties;
	const styles = { color: active == "true" ? 'green' : 'red' }

	// Update every second
	let interval = null;
    if ( active == "true" ) {
      interval = setInterval(() => {
        updateState({currentTime: new Date()});
		clearInterval(interval);
      }, 1000);
    } else if (active != "true" && seconds !== 0) {
      clearInterval(interval);
    }

	const getUTCTime = (d) => {
		// 2022-08-16 18:08:40
		if(!d)return;
		const arr = d.split(/[\-\s:]/g);
		arr[1] = arr[1] - 1;
		return new Date(Date.UTC(...arr));
	}

	return (
		<Fragment>
			<button 
			style={styles}
			on-click={() => {
				const {timestampTable } = properties;
				if(active !==  "true"){
					dispatch('INSERT_TIMESTAMP', {
						timestampTable,
						data: { active: true }
					})
				}else{
					// should we call this OPEN_ and CLOSE_TIMESTAMP?
					console.log('timestamptable', timestampTable);
					dispatch('UPDATE_TIMESTAMP', { timestampTable, 
						sys_id: properties.sysId,
						data: { active: false } 
					});
				}
				// updateState({timerActive: !state.timerActive});
			}
			}>{difference(currentTime, getUTCTime(start))}</button>
		</Fragment>
	);
};

createCustomElement('x-792462-timer-button', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		currentTime: null,
		startTime: null,
		test_start_time: null,
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		sysId: { default: null },
		active: { default: "false" },
		start: { default: null }
	},
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: ({state, dispatch, properties}) => {
			const {sysId, timestampTable} = properties;
			if(sysId){
				dispatch('FETCH_TIMER_STATUS', {sys_id: sysId, timestampTable});
			}
		}, // replace with REST
		'UPDATE_TIMESTAMP': createHttpEffect(`api/now/table/:timestampTable/:sys_id`, {
			method: 'PUT',
			pathParams: ['timestampTable', 'sys_id'],
			successActionType: 'UPDATE_SUCCESS',
			errorActionType: 'LOG_RESULT',
			startActionType: 'LOG_RESULT',
			dataParam: 'data',
		}),
		'FETCH_TIMER_STATUS': createHttpEffect(`api/now/table/:timestampTable/:sys_id`, {
			method: 'GET',
			pathParams: ['timestampTable', 'sys_id'],
			successActionType: 'SET_TIMER_STATUS',
			startActionType: 'LOG_RESULT',
			errorActionType: 'LOG_RESULT',
		}),
		'SET_TIMER_STATUS': ({action, updateState, updateProperties}) => {
			console.log('SET_TIMER_STATUS ', action.payload);
			// console.log(action.payload.result[0].sys_created_on);
			// updateState({
			// 	startTime: action.payload.result[0].sys_created_on,
			// 	test_start_time: action.payload.result[0].test_start_time
			// })
			updateProperties({
				start: action.payload.result.start_time,
				active: action.payload.result.active
			});

		},
		'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
		'INSERT_TIMESTAMP': createHttpEffect(`api/now/table/:timestampTable`, {
			method: 'POST',
			pathParams: ['timestampTable'],
			dataParam: 'data',
			headers: {},
			startActionType: 'INSERT_START',
			successActionType: 'INSERT_SUCCESS',
			errorActionType: 'INSERT_ERROR',
		}),
		'INSERT_START': ({host}) => console.log('REST called', host),
		'INSERT_SUCCESS': ({action, updateProperties, updateState}) => {
			console.log('INSERT RESULT:', action.payload);
			updateProperties({
				sysId: action.payload.result.sys_id,
				active: action.payload.result.active,
				start: action.payload.result.start_time,
			});
			// updateState({
			// 	startTime: action.payload.result.start_time,
			// 	// timerActive: action.payload.result.active,
			// 	// test_start_time: action.payload.result.test_start_time
			// });
		},
		'INSERT_ERROR': ({action}) => console.log(action.payload),
		'UPDATE_SUCCESS': ({action, updateProperties}) => {
			const {active} = action.payload.result;
			updateProperties({active});
		},
		'TEST_GET': createHttpEffect(`api/now/table/:table_name`, {
				pathParams: ['table_name'],
				method: 'GET',
				queryParams: ['sysparm_limit'],
				startActionType: 'TEST_START',
				successActionType: 'INSERT_SUCCESS',

			}),
		'TEST_START': () => console.log('test start'),
		'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload)
	}
});
