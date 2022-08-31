import '../x-esg-timer-button';
import '../project-item';
import { TimerHeader } from './components/TimerHeader';
import { AddProject } from './components/AddProject';

export const view = (state, {dispatch, updateState}) => {
    const {
        projects, 
        selectedProject,
        entryNotes, 
        genericProjects, 
        projectMap,
        properties,
        editableTimestamp,
        selectedDay,
    } = state;
    const {timeEntryTable, timestampTable } = properties;

    const {consultantId, editMode, addProjectStatus} = state.properties;

    if(consultantId == '') return <div>Loading...</div>;

    return (
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
                            <project-item
                                timestampTable={properties.timestampTable}
                                proj={proj}
                                editableTimestamp={editableTimestamp}
                                editMode={editMode}
                                selectedDay={selectedDay}
                                projectMap={projectMap}
                                consultantId={consultantId}
                            />
                        );
                    })}
                </div>
            </div>
    );
};