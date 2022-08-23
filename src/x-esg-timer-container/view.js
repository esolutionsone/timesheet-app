import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import {format} from 'date-fns';
import WebFont from 'webfontloader';

export const view = (state, {dispatch, updateState}) => {
    // Load Custom Fonts
    WebFont.load({
        google: {
            families: ['Montserrat:400,500,600,700', 'Material+Symbols+Outlined']
        }
    })
    const {projects, selectedProject, consultantId, entryNotes, genericProjects} = state;
    const allProjects = [...genericProjects, ...projects];
    const d = new Date();

    console.log('STATE', state);

    return (
        <Fragment>
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

                <div>
                    {projects.map(proj => {
                        const {client, short_description, sys_id} = proj;
                        return <div className="project-item" key={sys_id}>
                            <div className="client-name">{client.short_description}</div>
                            <div className="project-title">{short_description}</div>
                            <div className="project-notes">Example Notes</div>
                        </div>;
                    })}
                </div>
            </div>
            <form>
                <select on-change={(e)=>updateState({selectedProject: e.target.value})}>
                    <option disabled selected>Choose a Project</option>
                    {allProjects.map(proj => <option value={proj.sys_id}>
                        {proj.short_description}
                    </option>)}
                </select>
                <textarea 
                    on-keyup={(e)=> updateState({entryNotes: e.target.value})}
                    maxlength='512'
                ></textarea>
                <span 
                    className="material-symbols-outlined"
                    on-click={() => dispatch('NEW_ENTRY', {
                        data: {
                            project: selectedProject,
                            consultant: consultantId,
                            note: entryNotes,
                        },
                        tableName: 'x_esg_one_delivery_time_entry',
                    })}    
                >
                    add_circle_outline
                </span>
            </form>
            <hr></hr>
            {projects.map(proj => <x-esg-timer-button 
                projectData={proj}
                loadFonts={false}
                />)}
        </Fragment>
    );
};