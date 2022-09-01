import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';
import '../x-esg-week-view';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';
import view from './view.js';


createCustomElement('x-esg-timesheet-app', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		consultantId: '',
		location: 'day',
		addProjectStatus: false,
		editMode: false,
		genericProjects: [],
		projects: [],
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
	actionHandlers,
});
