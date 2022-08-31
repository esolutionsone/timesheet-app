import { msToString, hhmmToSnTime } from '../../x-esg-timer-button/helpers';
import { Timestamp } from './Timestamp';
import { isToday } from 'date-fns';
import '../../x-esg-timer-button';

export const DailyProject = ({
                                proj,
                                editableTimestamp, 
                                editMode, 
                                selectedDay, 
                                projectMap, 
                                dispatch, 
                                updateState }) => {
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
                    tableName: properties.timestampTable,
                    id: timestamp.sys_id,
                });
            });

            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(selectedDay)));
        } 
    }
    
    return (
        <div className="project-item" key={sys_id}>
            <div className="client-name">{client}</div>
            <div className="project-title-container">
                <div className="project-title">{short_description}</div>
                <div className="project-start-stop-container">
                    {isToday(selectedDay) ? <x-esg-timer-button 
                        projectData={proj}
                        active={active}
                        start={latestActive ? latestActive.start_time : null}
                        loadFonts={false}
                        sysId={latestActive ? latestActive.sys_id : null}
                    /> : ''}

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
                {timestamps.map(stamp => {
                    return (
                        <Timestamp 
                            stamp={stamp}
                            editableTimestamp={editableTimestamp}
                            editMode={editMode}
                            dispatch={dispatch}
                            updateState={updateState}
                        />
                    );
                })}
            </div>
        </div>
    );
}

