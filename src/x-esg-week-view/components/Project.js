import { Stage } from "./Stage"

export const Project = (props) => {
    const { psrs, updateState, addStages, name, entries, timestamps, dateArr } = props;
    let stageIds = [...new Set(psrs
        .filter(psr => {
            return (psr.project_role.project.current_stage.value == psr.project_stage.sys_id || psr.project_stage.sys_id == addStages[0])
        })
        .map(psr => psr.project_stage.sys_id))]

    // gets psrs that aren't visible on dom
    let dropDownPsrs = psrs.filter(psr => {
            return !stageIds.includes(psr.project_stage.sys_id)
        })
        console.log('psrs for dropdown',dropDownPsrs);
        
    let stagesDropDown = <select
                            on-change={(e)=>updateState({addStages: [e.target.value, ...addStages]})}>
                            <option disabled selected>Choose a stage</option>
                            {dropDownPsrs.map(psr => {
                                return(
                                    <option 
                                        value={psr.project_stage.sys_id}
                                    >
                                        {psr.project_stage.name}
                                    </option>
                                );
                            })}
                        </select>
        
    return (
        <div>
            <pre>{name}</pre>
            {stagesDropDown}
            {stageIds.map(sys_id => {
                let filteredPsrs = psrs.filter(psr => {
                    return sys_id === psr.project_stage.sys_id
                })
                return (
                    <Stage
                        {...props}
                        psrs={filteredPsrs}
                        name={filteredPsrs[0].project_stage.name}

                    />
                )
            })}
        </div>
    );
}