import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-icon';

export const view = (state,{ updateState, dispatch }) => {
    const projects = state.projects.map(proj => {
        const {short_description, sys_id} = proj;
        return {
            short_description,
            sys_id
        }
    })

    console.log('PROJECTS', state.projects);
    console.log(state);
    
    return (
        <Fragment>
            <pre>{JSON.stringify(projects, null, 2)}</pre>
        </Fragment>
    );
};