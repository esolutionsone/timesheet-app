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
		projects: [],
		selectedProject: '',
		consultantId: '',
		entryNotes: '',
		genericProjects: [],
		projectMap: new Map(),
		addProjectStatus: false,
		editMode: false,
		editableTimestamp: '',
		selectedDay: new Date(),
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
	actionHandlers,
});
