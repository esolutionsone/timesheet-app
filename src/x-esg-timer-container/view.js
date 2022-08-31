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
        entryNotes, 
        genericProjects, 
        projectMap,
        properties,
        editableTimestamp,
        selectedDay,
    } = state;

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
    );
};