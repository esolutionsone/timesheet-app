import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import {view} from './view';
import actionHandlers from './actionHandlers';
import styles from './styles.scss';

import WebFont from 'webfontloader';

// Load Custom Fonts
WebFont.load({
	google: {
		families: ['Montserrat:400,600', 'Material+Symbols+Outlined', 'Material+Symbols+Rounded']
	}
})

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
	},
	actionHandlers,
});
