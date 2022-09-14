import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';

export const Client = ({client, dateArr, dispatch, consultantId}) => {
    console.log('Client', client)

    const projectList = client.projects;
    

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