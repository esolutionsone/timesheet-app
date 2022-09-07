import WebFont from "webfontloader";

export default (state, {updateState}) => {
	const {
		consultantId, 
		addProjectStatus,
		editMode,
		genericProjects,
        projects,
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

    //Load state while waiting for initial fetch
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
                    projects={projects}
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
                    projects={projects}
				></x-esg-week-view>
			break;
		default:
			jsx = <div>Error: route not found</div>
	}

    console.log('APP STATE', state);

	return (
		<div>
			<div className="outer-buttons">
				{location == 'day' ?
					<div className="add-edit-buttons">
						<button 
							className="add-project-button"
							on-click={()=>updateState({
											addProjectStatus: !addProjectStatus, 
											editMode: false
										})
									}>
								<span className="material-symbols-outlined">add</span>
								Time Entry
						</button>
						<button 
							className="edit-button"
							on-click={()=>updateState({editMode: !editMode})}>
								<span className="material-symbols-outlined">edit_square</span>
								Edit
						</button>
					</div> 
					: 
					<div></div>
				}
				<div className={`${(location == 'week') ? 'timer-week-showing' : ''}`}>
					<button 
						className={`day-button ${(location == 'day') ? 'active' : ''}`}
						on-click={()=> updateState({location: 'day', addProjectStatus: false, editMode: false})}>
							Timers
					</button>
					<button 
						className={`week-button ${(location == 'week') ? 'active' : ''}`}
						on-click={()=> updateState({location: 'week', addProjectStatus: false, editMode: false})}>
							Week
					</button>
				</div>
			</div>
			{jsx}
		</div>
	)
}