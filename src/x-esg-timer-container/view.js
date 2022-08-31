import '../x-esg-timer-button';
import '@servicenow/now-icon';
import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import { TimerHeader } from './components/TimerHeader';
import { AddProject } from './components/AddProject';
import { DailyProject } from './components/DailyProject';
import WebFont from 'webfontloader';

export const view = (state, {dispatch, updateState}) => {
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

    const {
        projects, 
        selectedProject, 
        consultantId, 
        entryNotes, 
        genericProjects, 
        projectMap,
        addProjectStatus,
        editMode,
        properties,
        editableTimestamp,
        selectedDay,
    } = state;
    const {timeEntryTable, timestampTable } = properties;

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
                    timeEntryTable={timeEntryTable}
                    timestampTable={timestampTable}
                    consultantId={consultantId}
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