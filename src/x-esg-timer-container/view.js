import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import WebFont from 'webfontloader';

export const view = (state, {dispatch, updateState}) => {
    // Load Custom Fonts
    WebFont.load({
        google: {
            families: ['Montserrat:400,600', 'Material+Symbols+Outlined']
        }
    })
    const {projects, selectedProject, consultantId, entryNotes} = state;

    console.log('selectedProject', state.consultantId)
    return (
        <Fragment>
            {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
            <div>
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
            <select on-change={(e)=>updateState({selectedProject: e.target.value})}>
                <option></option>
                {projects.map(proj => <option value={proj.sys_id}>
                    {proj.short_description}
                </option>)}
            </select>
            <textarea 
                on-keyup={(e)=> updateState({entryNotes: e.target.value})}
                maxlength='512'
            ></textarea>
            </div>
            {projects.map(proj => <x-esg-timer-button 
                projectData={proj}
                loadFonts={false}
                />)}
        </Fragment>
    );
};