import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';
import { Project } from './Project';

export const Client = ({ psrs, updateState, addStages, name }) => {

    const projectIds = [...new Set(psrs.map(role => role.project_role.project.sys_id))]

    return (
        <div className="client-container">
            <div className="client-name">{name}</div>

            {projectIds.map(sys_id => {
                let filteredPsrs = psrs.filter(psr => {
                    return sys_id === psr.project_role.project.sys_id
                })
                return (
                    <Project
                        psrs={filteredPsrs}
                        updateState={updateState}
                        addStages={addStages}
                        name={filteredPsrs[0].project_role.project.short_description}
                    />
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
    );
}