import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';

export const Client = ({client, dateArr, dispatch, consultantId, project_stage_roles}) => {

    const projectList = client.projects;
    console.log('Project_stage_roles in week state', project_stage_roles);
    return (
        <div className="client-container">
            <span className="client-name">{client.short_description}</span>
            <div>
                {projectList.map(project => {
                    return (
                        <div className="project-item week-view-grid">
                            <div className="project-item-title">{project.short_description}</div>
                           
                            {dateArr.map(day => <ClientDay 
                                project={project} 
                                day={day}
                                dispatch={dispatch}
                                consultantId={consultantId}
                                />   
                            )}                
                        </div>
                    );
                })}
            </div>
        </div>
    );
}