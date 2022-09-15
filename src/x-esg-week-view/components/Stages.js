import { Role } from "./Role";

export const Stages = ({ psrs }) => {
    let stageIds = [...new Set(psrs
        .filter(psr => {
            return psr.project_role.project.current_stage.value == psr.project_stage.sys_id
        })
        .map(psr => psr.project_stage.sys_id))]

    let stagesDropDown = stageIds.map(sys_id => {
        let dropDPsrs = psrs.filter(psr => {
            return sys_id !== psr.project_stage.sys_id
        })
        console.log('psrs for dropdown',dropDPsrs);
        return (
            <select>
                <option disabled selected>Choose a Project</option>
                {dropDPsrs.map(psr => {
                    return(
                        <option value={psr.project_stage.sys_id}>{psr.project_stage.name}</option>
                    );
                })}
            </select>
        )
    })
    
    console.log('all stages', stageIds);

    return (
        <div >
            
            {stageIds.map(sys_id => {
                let filteredPsrs = psrs.filter(psr => {
                    return sys_id === psr.project_stage.sys_id
                })
                return (
                    <div>
                        {stagesDropDown}
                        <div>{filteredPsrs[0].project_stage.name}</div>
                        {filteredPsrs.map(psr => {
                            return (
                                <Role
                                   psr={psr}
                                />
                            );
                        })}
                        <br />
                    </div>
                )
            })}
        </div>
    );
}