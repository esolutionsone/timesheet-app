import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom } from '@servicenow/ui-renderer-snabbdom';
import { Timestamp } from '../x-esg-timer-container/components/Timestamp';
import styles from './styles.scss';
import WebFont from 'webfontloader';

const view = (state, { dispatch, updateState}) => {

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

	const { properties } = state;
	const {
		editMode,
		editableTimestamp,
		timestamps,
		timestampTable,
		consultantId
	} = properties;

	console.log('timestamp state', state);

	return (
		<div className="project-notes">
			{timestamps.map(stamp => {
				return (
					<Timestamp 
						stamp={stamp}
						editableTimestamp={editableTimestamp}
						editMode={editMode}
						dispatch={dispatch}
						updateState={updateState}
						timestampTable={timestampTable}
						consultantId={consultantId}
					/>
				);
			})}
		</div>
	);
}

createCustomElement('timestamp-list', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		showDetail: true
	},
	properties: {
		editableTimestamp: {default: ''},
		editMode: {default: false},
		timestamps: {default: []},
		timestampTable: {default: ''},
		consultantId: {default: ''}
	}
});
