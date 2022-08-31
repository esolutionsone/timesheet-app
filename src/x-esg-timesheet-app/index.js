import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';
import WebFont from 'webfontloader';
import actionHandlers from './actionHandlers';

const view = (state) => {
	const {consultantId} = state;
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

	if(consultantId == ''){
		return <div>Loading...</div>
	}

	console.log('consultantId exists')
	return <div>
		<x-esg-timer-container
			timestampTable={timestampTable}
			timeEntryTable={timeEntryTable}
			consultantId={consultantId}
		></x-esg-timer-container>
	</div>
}

createCustomElement('x-esg-timesheet-app', {
	renderer: {type: snabbdom},
	view,
	initialState: {
		consultantId: '',
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
	actionHandlers,
});
