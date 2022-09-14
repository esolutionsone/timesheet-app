import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import {view} from './view';
import actionHandlers from './actionHandlers';
import styles from './styles/styles.scss';


createCustomElement('x-esg-timer-container', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		selectedProject: '',
		consultantId: '',
		entryNotes: '',
		projectMap: new Map(),
		addProjectStatus: false,
		editMode: false,
		showNotes: true,
		editableTimestamp: '',
		selectedDay: new Date(),
	},
	properties: {
		consultantId: {default: ''},
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
		addProjectStatus: {default: false},
		editMode: {default: false},
		genericProjects: {default: []},
		projects: {default: []}
	},
	actionHandlers,
});
