import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';
import { Project } from './Project';
import { Stages } from './Stage';

export const Client = ({ psrs, updateState, addStages, name }) => {

    console.log(psrs);
    const projectIds = [...new Set(psrs.map(role => role.project_role.project.sys_id))]
    console.log('all projects', projectIds);
    // const projectList = client.projects;
    // console.log('Project_stage_roles in week state', project_stage_roles);
    console.log(name); 
    return (
        <div className="client-container">
            <span className="client-name">{name}</span>

            <div>
                {projectIds.map(sys_id => {
                    let filteredPsrs = psrs.filter(psr => {
                        return sys_id === psr.project_role.project.sys_id
                    })
                    return (
                        <div>
                            <Project
                                psrs={filteredPsrs}
                                updateState={updateState}
                                addStages={addStages}
                                name={filteredPsrs[0].project_role.project.short_description}
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