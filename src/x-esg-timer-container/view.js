import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';
import WebFont from 'webfontloader';

export const view = (state, {dispatch}) => {
    // Load Custom Fonts
    WebFont.load({
        google: {
            families: ['Montserrat:400,600', 'Material+Symbols+Outlined']
        }
    })
    const {projects, selectedProject, consultantId} = state;

    console.log('selectedProject', state.selectedProject)
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
                    },
                    tableName: 'x_esg_one_delivery_time_entry',
                })}    
            >
                add_circle_outline
            </span>
            <select on-change={(e)=>dispatch('SET_SELECTED_PROJECT', e.target.value)}>
                <option></option>
                {projects.map(proj => <option value={proj.sys_id}>
                    {proj.short_description}
                </option>)}
            </select>
            </div>
            {projects.map(proj => <x-esg-timer-button 
                projectData={proj}
                loadFonts={false}
                />)}
        </Fragment>
    );
};