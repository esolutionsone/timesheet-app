import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import {format} from 'date-fns';
import WebFont from 'webfontloader';

export const view = (state, {dispatch, updateState}) => {
    // Load Custom Fonts
    WebFont.load({
        google: {
            families: ['Montserrat:400,500,600,700', 'Material+Symbols+Outlined', 'Material+Symbols+Rounded']
        }
    })
    const {projects, selectedProject, consultantId, entryNotes, genericProjects, addProjectStatus} = state;
    const allProjects = [...genericProjects, ...projects];
    const d = new Date();

    const handleSave = (e) => {
        e.preventDefault();
        console.log('saved');
        dispatch('NEW_ENTRY', {
                data: {
                    project: selectedProject,
                    consultant: consultantId,
                    note: entryNotes,
                },
                tableName: 'x_esg_one_delivery_time_entry',
            });
        updateState({addProjectStatus: !addProjectStatus});

    }
    // on-click={() => dispatch('NEW_ENTRY', {
    //     data: {
    //         project: selectedProject,
    //         consultant: consultantId,
    //         note: entryNotes,
    //     },
    //     tableName: 'x_esg_one_delivery_time_entry',
    // })}
    console.log(state);
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
                <button className="edit-button">
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
                        <span className="project-time"> 8:47</span>
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
                    {projects.map(proj => {
                        const {client, short_description, sys_id} = proj;
                        return <div className="project-item" key={sys_id}>
                                    <div className="client-name">{client.short_description}</div>
                                    <div className="project-title-container">
                                        <div className="project-title">{short_description}</div>
                                        <div className="project-start-stop-container">
                                            {<x-esg-timer-button />}
                                            {/* <span className="material-symbols-rounded active">
                                                play_arrow
                                            </span>
                                            <span className="project-time"> 5:07</span> */}
                                        </div>
                                    </div>
                                    <div className="project-notes">Example Notes</div>
                                </div>;
                        })
                    }
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