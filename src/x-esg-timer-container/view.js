import '../x-esg-timer-button';
import '@servicenow/now-icon';
import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import { TimerHeader } from './components/TimerHeader';
import { AddProject } from './components/AddProject';
import { DailyProject } from './components/DailyProject';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../payloads';
import { getSnDayBounds } from '../helpers';

export const view = (state, {dispatch, updateState}) => {
    const {
        projects, 
        selectedProject, 
        // consultantId, 
        entryNotes, 
        genericProjects, 
        projectMap,
        addProjectStatus,
        editMode,
        properties,
        editableTimestamp,
        selectedDay,
    } = state;

    const {consultantId} = state.properties;

    console.log(consultantId)

    if(consultantId == '') return <div>Loading...</div>;

    // if(!consultantId){
    //     return <div>Loading...</div>
    //     dispatch('LOG_ERROR', {msg: 'result.length !==1', data: action.payload});
    // }else{
    //     dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(selectedDay)));
    //     dispatch('FETCH_PROJECTS', {
    //         tableName: 'x_esg_one_core_project_role', 
    //         sysparm_query: `consultant_assigned=${consultantId}`,
    //         sysparm_fields: `
    //             project.sys_id,
    //             project.short_description,
    //             project.client.short_description,
    //             project.client.sys_id
    //         `
    //     })
    // }

    return (
        <Fragment>
            <div className="outer-buttons">
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
            <div className="today-container">
                <TimerHeader 
                    consultantId={consultantId}
                    updateState={updateState}
                    dispatch={dispatch}
                    projectMap={projectMap}
                    selectedDay={selectedDay}
                />
                <AddProject 
                    addProjectStatus={addProjectStatus}
                    projects={projects}
                    selectedProject={selectedProject}
                    entryNotes={entryNotes}
                    genericProjects={genericProjects}
                    properties={properties}
                    projectMap={projectMap}
                    dispatch={dispatch}
                    updateState={updateState}
                />
                <div>
                    {Array.from(projectMap.values()).map(proj => {
                        return (
                            <DailyProject 
                                proj={proj}
                                editableTimestamp={editableTimestamp}
                                editMode={editMode}
                                selectedDay={selectedDay}
                                projectMap={projectMap}
                                dispatch={dispatch}
                                updateState={updateState}
                            />
                        );
                    })}
                </div>
            </div>
        </Fragment>
    );
};