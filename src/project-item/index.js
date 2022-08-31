import { createCustomElement } from '@servicenow/ui-core';
import { snabbdom } from '@servicenow/ui-renderer-snabbdom';
import { Timestamp } from '../x-esg-timer-container/components/Timestamp';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../x-esg-timer-container/payloads';
import { msToString, getSnDayBounds } from '../x-esg-timer-button/helpers';
import { isToday } from 'date-fns';
import styles from './styles.scss';
import WebFont from 'webfontloader';
import '../x-esg-timer-button';

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

	const { properties, showDetail } = state;
	const {
            editMode,
            timestampTable,
            consultantId,
            editableTimestamp,
            proj,
            projectMap,
            selectedDay,

        } = properties;

	const {
            client, 
            short_description, 
            sys_id, 
            active, 
            timestamps
        } = proj;

	const latestActive = timestamps.find(stamp => stamp.active === "true");

    const handleDeleteProject = (e, projectToBeDeleted) => {
        e.preventDefault();
        if (confirm("Click OK to remove this project") == true) {
            projectToBeDeleted.timestamps.forEach(timestamp => {
                dispatch('DELETE_PROJECT_TIMESTAMPS', {
                    tableName: timestampTable,
                    id: timestamp.sys_id,
                });
            });

            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(selectedDay)));
        } 
    }

	console.log('timestamp state', state);
	console.log('editableTimestamp', editableTimestamp);
	return (
		<div className="project-item" key={sys_id}>
            <div className="client-name">{client}</div>
            <div className="project-title-container">
                <div className="project-title">{short_description} 
                    {showDetail ? 
                        <span 
                            className="material-symbols-outlined details-icon" 
                            on-click={() => {updateState({showDetail: !showDetail})}}
                        >
                                expand_less
                        </span>
                        :
                        <span 
                            className="material-symbols-outlined details-icon" 
                            on-click={() => {updateState({showDetail: !showDetail})}}
                        >
                                expand_more
                        </span>}
                </div>
                <div className="project-start-stop-container">
                    {isToday(selectedDay) ? 
                        <x-esg-timer-button 
                            projectData={proj}
                            active={active}
                            start={latestActive ? latestActive.start_time : null}
                            loadFonts={false}
                            sysId={latestActive ? latestActive.sys_id : null}
                        /> 
                        : 
                        ''
                    }
                <div>{msToString(projectMap.get(sys_id).totalRoundedTime)}</div>
                    {!editMode ? 
                        '' 
                        : 
                        <span 
                            className="material-symbols-rounded remove-project"
                            on-click={(e) => handleDeleteProject(e, proj)}
                        >
                            delete_forever
                        </span>
                    }
                </div>
            </div>
            <div className="project-notes">
                {timestamps.map((stamp, i) => {
                    if (!showDetail && active && (i > 0)) return
                    if (!showDetail && !active) return
                    return (
                        <Timestamp 
                            stamp={stamp}
                            editableTimestamp={editableTimestamp}
                            editMode={editMode}
                            dispatch={dispatch}
                            updateState={updateState}
                            timestampTable={timestampTable}
                            consultantId={consultantId}
                            selectedDay={selectedDay}
                        />
                    );
                })}
            </div> 
		</div>
	);
}

createCustomElement('project-item', {
	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		showDetail: true
	},
	properties: {
		editableTimestamp: {default: ''},
		editMode: {default: false},
		timestampTable: {default: ''},
		consultantId: {default: ''},
		proj: {default: {}},
		projectMap: {default: []},
		selectedDay: {default: ''}
	}
});
