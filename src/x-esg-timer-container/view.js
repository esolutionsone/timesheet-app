import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import {format, formatDistanceToNow, min} from 'date-fns';
import { msToString, hhmmToSnTime, getUTCTime, toSnTime } from '../x-esg-timer-button/helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from './payloads';
import { ProjectItem } from './components/Project';
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
    } = state;
    
    // Combine Generic projects and user-specific projects,
    // Then filter out projects that are already being tracked today
    const allProjects = [...genericProjects, ...projects].filter(proj => {
        return !projectMap.has(proj.sys_id)
    });

    const d = new Date();

    const handleSave = (e) => {
        e.preventDefault();
        if (selectedProject == '') {
            alert('Please select a project before continuing.')
        } else {
            dispatch('NEW_ENTRY', {
                data: {
                    project: selectedProject,
                    consultant: consultantId,
                    note: entryNotes,
                },
                // tableName: 'x_esg_one_delivery_time_entry',
                tableName: properties.timeEntryTable,
            });
            dispatch('INSERT_TIMESTAMP', {
                data: { 
                    active: true, 
                    project: selectedProject,
                    note: entryNotes,
                },
                // tableName: 'x_esg_one_delivery_timestamp',
                tableName: properties.timestampTable,
            });
        }
    }

    const handleEdit = (e) => {
        e.preventDefault();
        updateState({editMode: !editMode});
    }

    const handleDeleteProject = (e, projectToBeDeleted) => {
        e.preventDefault();
        if (confirm("Click OK to remove this project") == true) {
            projectToBeDeleted.timestamps.forEach(timestamp => {
                dispatch('DELETE_PROJECT_TIMESTAMPS', {
                    tableName: properties.timestampTable,
                    id: timestamp.sys_id,
                });
            });

            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId));
        } 
    }

    const handleDeleteTimestamp = (e, sys_id) => {
        e.preventDefault();
        console.log('Timestamp to be deleted', sys_id);
        if (confirm("Click OK to remove this timestamp") == true) {
            dispatch('DELETE_PROJECT_TIMESTAMPS', {
                tableName: properties.timestampTable,
                id: sys_id,
            });

            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId));
        } 
    }

    const handleUpdateTimestamp = (sys_id, data, timeToCheck) => {
        let timeNow = new Date();

        if (data.end_time && (data.end_time < timeToCheck)) {
            updateState({editableTimestamp: ''})
            alert('End time cannot be earlier than start time.');
            return 
        } else if (data.start_time && timeToCheck && (data.start_time > timeToCheck)) {
            updateState({editableTimestamp: ''})
            alert('Start time cannot be later than end time.');
            return
        } 
        else if (data.start_time && (data.start_time > toSnTime(timeNow))) {
            updateState({editableTimestamp: ''})
            alert('Start time cannot be later than current time.');
            return
        }

        dispatch('UPDATE_TIMESTAMP', {
            tableName: 'x_esg_one_delivery_timestamp',
            sys_id,
            data,
        })
        updateState({editableTimestamp: ''});
    }

    let totalTime = Array.from(projectMap.values()).reduce((sum, val) => sum += val.totalRoundedTime, 0);
    totalTime = msToString(totalTime);

    console.log('CURRENT STATE -', state);

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
                    <div>
                        <span className="title">Today</span>
                        <span>{format(d, 'E MMM d, Y')}</span>
                    </div>
                    <div>
                        <span>Total </span>
                        <span className="project-time"> {totalTime}</span>
                    </div>
                </div>

                {!addProjectStatus ? 
                <div></div> 
                : 
                <div>
                    <span className="new-project-header">Project / Task</span>
                    <form className="new-project-body" on-submit={handleSave}>
                        <select
                            className="new-project-dropdown"
                            on-change={(e)=>updateState({selectedProject: e.target.value})}>
                                <option disabled selected>Choose a Project</option>
                                {allProjects.map(proj => <option value={proj.sys_id}>
                                    {proj.short_description}
                                </option>)}
                        </select>
                        <div className="new-project-text-container">
                            <textarea 
                                className="new-project-text"
                                on-keyup={(e)=> updateState({entryNotes: e.target.value})}
                                maxlength='512'
                                placeholder="Enter your notes here..."
                            ></textarea>

                            <button className="new-project-save-button">
                                Save
                            </button>
                        </div>
                    </form>
                </div>}
                <ProjectItem 
                    projectList={Array.from(projectMap.values())}
                    state={state}
                />
            </div>
        </Fragment>
    );
};