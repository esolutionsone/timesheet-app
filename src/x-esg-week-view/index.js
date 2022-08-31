import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';

const view = (state) => {
	return <div>
		WEEK VIEW BAYBAY
	</div>
}

createCustomElement('x-esg-week-view', {
	renderer: {type: snabbdom},
	view,
	initialState: {
		
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
});
