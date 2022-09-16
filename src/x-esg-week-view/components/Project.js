import { Stage } from "./Stage"

export const Project = ({ psrs, updateState, addStages, name }) => {

    let stageIds = [...new Set(psrs
        .filter(psr => {
            return (psr.project_role.project.current_stage.value == psr.project_stage.sys_id || addStages.includes(psr.project_stage.sys_id))
        })
        .map(psr => psr.project_stage.sys_id))]

    // gets psrs that aren't visible on dom
    let dropDownPsrs = psrs.filter(psr => {
            return !stageIds.includes(psr.project_stage.sys_id)
        })

    let stagesDropDown
    if (dropDownPsrs.length >= 1) {
        stagesDropDown = <select
                            on-change={(e)=>updateState({addStages: [e.target.value, ...addStages]})}>
                            <option disabled selected>Choose a Stage</option>
                            {dropDownPsrs.map(psr => {
                                return (
                                    <option 
                                        value={psr.project_stage.sys_id}
                                    >
                                        {psr.project_stage.name}
                                    </option>
                                );
                            })}
                        </select>
    } else {
        stagesDropDown = ''
    }
    
    
    
    return (
        <div>
            <div className='project-item'>{name} <span>{stagesDropDown}</span> </div>
            {stageIds.map(sys_id => {
                let filteredPsrs = psrs.filter(psr => {
                    return sys_id === psr.project_stage.sys_id
                })
                return (
                    <Stage
                        psrs={filteredPsrs}
                        updateState={updateState}
                        addStages={addStages}
                        name={filteredPsrs[0].project_stage.name}
                    />
                )
            })}
        </div>
    );
}