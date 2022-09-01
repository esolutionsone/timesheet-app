import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';
import styles from './styles.scss';
import actionHandlers from './actionHandlers';

const view = (state) => {
	console.log('week state', state);

	const sortByClients = new Map();

	const {projectMap} = state;

	console.log('projectMap');

	projectMap.forEach(proj => {
		console.log(proj)
	})
	return <div className="week-container">
		WEEK VIEW
	</div>
}

createCustomElement('x-esg-week-view', {
	renderer: {type: snabbdom},
	view,
	initialState: {
		selectedDay: new Date(),
		projectMap: new Map(),
	},
	styles,
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
		addProjectStatus: {default: false},
		editMode: {default: false},
		consultantId: {default: ''},
	},
	actionHandlers
});
