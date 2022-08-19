import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';

export const view = (state,{ updateState, dispatch }) => {
const {projects} = state

    console.log('PROJECTS', state.projects);
    console.log(state);

    
    return (
        <Fragment>
            <pre>{JSON.stringify(projects, null, 2)}</pre>
            <x-esg-timer-button projectData={projects[0]}></x-esg-timer-button>
        </Fragment>
    );
};