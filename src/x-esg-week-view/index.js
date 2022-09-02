import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom } from '@servicenow/ui-renderer-snabbdom';
import { view } from './view';
import '../x-esg-timer-container';
import styles from './styles.scss';
import actionHandlers from './actionHandlers';

createCustomElement('x-esg-week-view', {
	renderer: {type: snabbdom},
	view,
	initialState: {
		selectedDay: new Date(),
		projectMap: new Map(),
		clientMap: new Map(),
		dailyEntries: []
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
