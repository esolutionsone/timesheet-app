import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';
import { Role } from './Role';
export const Client = ({psrs}) => {

    console.log(psrs);
    const projectIds = [...new Set(psrs.map(role => role.project_role.project.sys_id))]
    console.log('all clients', projectIds);
    // const projectList = client.projects;
    // console.log('Project_stage_roles in week state', project_stage_roles);
    // console.log(roleName);
    return (
        <div className="client-container">
            <span className="client-name">{psrs[0].project_role.project.client.short_description}</span>

            <div>
                {projectIds.map(sys_id => {
                    let filteredPsrs = psrs.filter(psr => {
                        return sys_id === psr.project_role.project.sys_id
                    })
                    return (
                        <div>
                            <pre>
                                {filteredPsrs[0].project_role.project.short_description}
                            </pre>
                            <Role
                                psrs={filteredPsrs}
                            />
                        </div>
                    );

                })}
                {/* {projectList.map(project => {
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
                })}*/}
            </div>
        </div>
    );
}