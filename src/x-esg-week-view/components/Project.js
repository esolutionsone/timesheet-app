import { Stage } from "./Stage"
import { getTimeAdjustment } from "./RoleDayHelpers";

export const Project = (props) => {
    const { psrs, updateState, addStages, name, entries, timestamps, dateArr } = props;

    let entryStages = [...new Set(entries.map(entry => entry.project_stage_role.project_stage.sys_id))]

    let stageIds = [...new Set(psrs
        .filter(psr => {
            return (psr.project_role.project.current_stage.value == psr.project_stage.sys_id || addStages.includes(psr.project_stage.sys_id) || entryStages.includes(psr.project_stage.sys_id))
        })
        .map(psr => psr.project_stage.sys_id))]

    let projects = [...new Set(psrs.map(psr => psr.sys_id))]
    let projectEntries = entries.filter( entry => projects.includes(entry.project_stage_role.sys_id))
    let projectHours = 0;

    projectEntries.forEach(entry => {
        //once timestamps are incorporated, will need to add timestamp hours too
        projectHours += getTimeAdjustment(entry)
    });
    console.log('Hours spent on project', projectHours);

    // gets psrs that aren't visible on dom
    let dropDownPsrs = psrs.filter(psr => {
            return !stageIds.includes(psr.project_stage.sys_id)
        })

    let stagesDropDown
    if (dropDownPsrs.length >= 1) {
        stagesDropDown = <select
                            className='stages-dropdown'
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
            <div>{projectHours}</div>
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