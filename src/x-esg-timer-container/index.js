import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import {view} from './view';
import { toSnTime } from '../x-esg-timer-button/helpers';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';

import WebFont from 'webfontloader';

// Load Custom Fonts
WebFont.load({
	google: {
		families: ['Montserrat:400,600', 'Material+Symbols+Outlined', 'Material+Symbols+Rounded']
	}
})

// const startTime = toSnTime(new Date(new Date().setHours(0,0,0,0)));
// const endTime = toSnTime(new Date(new Date().setHours(24,0,0,0)));

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
		// dateRange: [startTime, endTime],
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
	actionHandlers,
});
