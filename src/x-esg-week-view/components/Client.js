import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';

export const Client = ({client, dateArr, dispatch, consultantId, project_stage_roles}) => {

    const projectList = client.projects;
    const roleName = project_stage_roles[0]['project_role.short_description'];
    // console.log('Project_stage_roles in week state', project_stage_roles);
    // console.log(roleName);
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