import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../../x-esg-timer-button';
import {format, formatDistanceToNow, min} from 'date-fns';
import { msToString, hhmmToSnTime, getUTCTime, toSnTime } from '../../x-esg-timer-button/helpers';
import WebFont from 'webfontloader';


export const ProjectItem = ({projectList, state}) => {
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
        projectMap,
        editMode,
        editableTimestamp,
    } = state;

    console.log('projectList', projectList);
    console.log('fdsaf');
    
    return (
        <Fragment>
        </Fragment>
    );
}

