import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import {view} from './view';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';

createCustomElement('x-esg-timer-button', {
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
		start: { default: null },
		projectData: {default: {}},
		loadFonts: true,
	},
	actionHandlers,
});
