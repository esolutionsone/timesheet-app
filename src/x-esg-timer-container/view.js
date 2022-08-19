import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../x-esg-timer-button';
import '@servicenow/now-icon';

export const view = (state) => {
const {projects} = state
    return (
        <Fragment>
            {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
            {projects.map(proj => <x-esg-timer-button 
                projectData={proj}
                loadFonts={false}
                />)}
        </Fragment>
    );
};