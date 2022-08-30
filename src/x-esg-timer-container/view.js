import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import {format, formatDistanceToNow, isToday} from 'date-fns';
import { msToString, hhmmToSnTime, getUTCTime, toSnTime, getSnDayBounds } from '../x-esg-timer-button/helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from './payloads';
import { DailyProject } from './components/DailyProject';
import { AddProject } from './components/AddProject';
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
    
    const handleEdit = (e) => {
        e.preventDefault();
        updateState({editMode: !editMode});
    }

    /**
     * Increments state.selectedDay 1 day forward or backward
     * @param {bool} forward 
     */
    const incrementDate = (forward) => {
        // Calculate 1 day forward/backward
        let increment = 24 * 60 * 60 * 1000 * (forward ? 1: -1);

        let d = new Date(selectedDay.getTime() + increment)
        updateState({selectedDay: d});
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(d)
            )
        );
    }

    // Calculate the total rounded time from the timestamps in projectMap
    let totalTime = Array.from(projectMap.values())
        .reduce((sum, val) => sum += val.totalRoundedTime, 0);
    totalTime = msToString(totalTime);

    // Determine message for today-header
    let howLongAgo = "Today";
    const dayStart = new Date().setHours(0,0,0,0);
    if(selectedDay < dayStart){
        howLongAgo = formatDistanceToNow(selectedDay) + ' ago';
    }

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
                    on-click={handleEdit}>
                        <span className="material-symbols-outlined">
                            edit_square
                        </span>
                        Edit
                </button>
            </div>
            <div className="today-container">
                <div className="today-header">
                        <span className="title">{howLongAgo}</span>
                        <span className="header-date">
                            <span className="material-symbols-outlined date-chevron"
                                on-click={() => incrementDate(false)}>
                                chevron_left
                            </span>
                            <span>{format(selectedDay, 'E MMM d, Y')}</span>
                            <span className={`material-symbols-outlined 
                                    date-chevron 
                                    ${isToday(selectedDay) && 'disabled'}`
                                }
                                on-click={() => !isToday(selectedDay) && incrementDate(true)}
                            >
                                chevron_right
                            </span>
                        </span>
                    <div className="today-total">
                        <span>Total </span>
                        <span className="project-time"> {totalTime}</span>
                    </div>
                </div>
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