import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-button';
import styles from './styles.scss';

const view = (state, {updateState}) => {
	return (
		<now-button>{state.previousTime}</now-button>
	);
};

createCustomElement('x-792462-timer-button', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		previousTime: 0,
	},
	actionHandlers: {
		'NOW_BUTTON#CLICKED': ({action}) => console.log('clicked'),
		'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
	}
});
