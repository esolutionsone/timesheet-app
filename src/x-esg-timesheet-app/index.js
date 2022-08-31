import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';
import WebFont from 'webfontloader';

const view = (state) => {
	const {timestampTable, timeEntryTable} = state.properties;
	// Load Custom Fonts
	WebFont.load({
		google: {
			families: [
				'Montserrat:400,500,600,700', 
				'Material+Symbols+Outlined', 
				'Material+Symbols+Rounded'
			]
		}
	})

	return <div>
		<x-esg-timer-container
			timestampTable={timestampTable}
			timeEntryTable={timeEntryTable}
		></x-esg-timer-container>
	</div>
}

createCustomElement('x-esg-timesheet-app', {
	renderer: {type: snabbdom},
	view,
	initialState: {
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
	actionHandlers,
});
