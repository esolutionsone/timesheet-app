import {createCustomElement} from '@servicenow/ui-core';
import {snabbdom} from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-container';
import WebFont from 'webfontloader';
import actionHandlers from './actionHandlers';
import '../x-esg-week-view';
import styles from './styles.scss';

const view = (state, {updateState}) => {
	const {
		consultantId, 
		addProjectStatus,
		editMode,
		genericProjects,
		location
	} = state;
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

	// Router
	let jsx;
	switch(state.location){
		case 'day':
			jsx = <x-esg-timer-container
					timestampTable={timestampTable}
					timeEntryTable={timeEntryTable}
					consultantId={consultantId}
					addProjectStatus={addProjectStatus}
					editMode={editMode}
					genericProjects={genericProjects}
				></x-esg-timer-container>;
			break;
		case 'week':
			jsx = <x-esg-week-view 
					timestampTable={timestampTable}
					timeEntryTable={timeEntryTable}
					consultantId={consultantId}
					addProjectStatus={addProjectStatus}
					editMode={editMode}
					genericProjects={genericProjects}
				></x-esg-week-view>
			break;
		default:
			jsx = <div>Error: route not found</div>
	}

	return (
		<div>
			<div className="outer-buttons">
				<div className="add-edit-buttons">
					<button 
						className="add-project-button"
						on-click={()=>updateState({
										addProjectStatus: !addProjectStatus, 
										editMode: false
									})
								}>
							<span className="material-symbols-outlined">add</span>
							Project
					</button>
					<button 
						className="edit-button"
						on-click={()=>updateState({editMode: !editMode})}>
							<span className="material-symbols-outlined">edit_square</span>
							Edit
					</button>
				</div>
				<div>
					<button 
						className={`day-button ${(location == 'day') ? 'active' : ''}`}
						on-click={()=> updateState({location: 'day'})}>
							Day
					</button>
					<button 
						className={`week-button ${(location == 'week') ? 'active' : ''}`}
						on-click={()=> updateState({location: 'week'})}>
							Week
					</button>
				</div>
			</div>
			{jsx}
			<div >

			</div>
		</div>
		
	)
}

createCustomElement('x-esg-timesheet-app', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		consultantId: '',
		location: 'day',
		addProjectStatus: false,
		editMode: false,
	},
	properties: {
		timestampTable: {default: "x_esg_one_delivery_timestamp"},
		timeEntryTable: {default: "x_esg_one_delivery_time_entry"},
	},
	actionHandlers,
});
