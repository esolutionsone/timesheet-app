import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';
import styles from './styles.scss';

const view = (state) => {
	return <div className="week-container">
		WEEK VIEW
	</div>
}

createCustomElement('x-esg-week-view', {
	renderer: {type: snabbdom},
	view,
	initialState: {
		
	},
	styles,
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
		addProjectStatus: {default: false},
		editMode: {default: false}
	},
});
