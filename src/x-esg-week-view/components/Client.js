import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';
import ClientDay from './ClientDay';
import { Project } from './Project';

export const Client = (props) => {
    const { psrs, name } = props;
    const projectIds = [...new Set(psrs.map(role => role.project_role.project.sys_id))]

    return (
        <div className="client-container">
            <div className="client-name">{name}</div>

            <div>
                {projectIds.map(sys_id => {
                    let filteredPsrs = psrs.filter(psr => {
                        return sys_id === psr.project_role.project.sys_id
                    })
                    return (
                        <div>
                            <Project
                                {...props}
                                psrs={filteredPsrs}
                                name={filteredPsrs[0].project_role.project.short_description}         
                            />
                        </div>
                    );

            })}
            </div>
        </div>
    );
}