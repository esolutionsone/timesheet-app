import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import {format} from 'date-fns';
import { msToString } from '../x-esg-timer-button/helpers';
import WebFont from 'webfontloader';

export const view = (state, {dispatch, updateState}) => {
    // Load Custom Fonts
    WebFont.load({
        google: {
            families: ['Montserrat:400,500,600,700', 'Material+Symbols+Outlined', 'Material+Symbols+Rounded']
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
        properties
    } = state;
    
    const allProjects = [...genericProjects, ...projects];
    const d = new Date();

    const handleSave = (e) => {
        e.preventDefault();
        dispatch('NEW_ENTRY', {
            data: {
                project: selectedProject,
                consultant: consultantId,
                note: entryNotes,
            },
            tableName: 'x_esg_one_delivery_time_entry',
        });
        dispatch('INSERT_TIMESTAMP', {
            data: { 
                active: true, 
                project: selectedProject
            },
            tableName: 'x_esg_one_delivery_timestamp'
        })
        updateState({addProjectStatus: !addProjectStatus});
    }

    const handleEdit = (e) => {
        e.preventDefault();
        console.log('edit clicked');
        updateState({editMode: !editMode});
    }

    const handleDeleteProject = (e, projectToBeDeleted) => {
        e.preventDefault();
        console.log('delete project clicked');

        console.log("Project to be deleted", projectToBeDeleted);

        projectToBeDeleted.timestamps.forEach(timestamp => {
            console.log(timestamp);
        });

        // dispatch('DELETE_PROJECT_TIMESTAMPS', {
        //     tableName: properties.timestampTable,
        //     id: projectToBeDeleted.sys_id,
        // })
    }

    console.log('STATE', state);

    let totalTime = Array.from(projectMap.values()).reduce((sum, val) => sum += val.totalRoundedTime, 0);
    totalTime = msToString(totalTime);

    return (
        <Fragment>
            <div className="outer-buttons">
                <button 
                    className="add-project-button"
                    on-click={()=>updateState({addProjectStatus: !addProjectStatus})}
                    >
                    <span className="material-symbols-outlined">add</span>
                    Project
                </button>
                <button className="edit-button"
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

                            <button
                                className="new-project-save-button"
                                on-click={()=>console.log("clicked")}>
                                    Save
                            </button>
                        </div>
                    </form>
                </div>}
                <div>
                    {Array.from(projectMap.values()).map(proj => {
                        const {client, short_description, sys_id, note} = proj;
                        return (
                            <div className="project-item" key={sys_id}>
                                <div className="client-name">{client}</div>
                                <div className="project-title-container">
                                    <div className="project-title">{short_description}</div>
                                    <div className="project-start-stop-container">
                                        {<x-esg-timer-button 
                                            projectData={proj}
                                            loadFonts={false}/>
                                        }
                                        <div>
                                            {editMode ? 
                                                <input 
                                                    className="roundedTime-input-box" 
                                                    value={msToString(projectMap.get(sys_id).totalRoundedTime)}
                                                /> 
                                                : 
                                                msToString(projectMap.get(sys_id).totalRoundedTime)
                                            }
                                        </div>
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
                                    {!editMode ? 
                                        note 
                                        :
                                        <textarea 
                                            className="edit-project-text"
                                            on-keyup={(e)=> updateState({entryNotes: e.target.value})}
                                            maxlength='512'
                                            value={note}>
                                        </textarea> 
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <hr></hr>
            {projects.map(proj => <x-esg-timer-button 
                projectData={proj}
                loadFonts={false}
                />)}
        </Fragment>
    );
};