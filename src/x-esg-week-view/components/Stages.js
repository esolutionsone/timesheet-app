import { Role } from "./Role";

export const Stages = ({psrs}) => {
    let stageIds = [...new Set(psrs
        .filter(psr => {
            console.log("PSR", psr.project_role.project.current_stage.value);
            console.log("PSR", psr.project_stage.sys_id);
            return psr.project_role.project.current_stage.value == psr.project_stage.sys_id
        })
        .map(psr => psr.project_stage.sys_id))]


    // if (psrs. !== psr.project_role.project.current_stage.value){
        
    // }
    console.log('all stages', stageIds);

    return (
        <div >
            {stageIds.map(sys_id => {
                let filteredPsrs = psrs.filter(psr => {
                    return sys_id === psr.project_stage.sys_id
                })
                return (
                    <div>
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