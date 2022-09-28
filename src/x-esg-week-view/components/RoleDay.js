import { stringifyDuration } from "../../helpers";
import { 
    enforceMinMax,
    getTimestampHours,
    getTimeAdjustment,
    getNoteValue,
    isMissingNote,
 } from "./RoleDayHelpers";

const RoleDay = ({
    psr,
    entry,
    timestamps,
    date,
    dispatch,
    consultantId,
    index,
    selectedDay,
    entryState,
}) => {

    const project = psr.project_role.project;
    const today = new Date();
    const editableInputs = entryState === 'draft' && selectedDay <= today;

    // Get sum of today's entry and today's timestamps
    const hours = getTimeAdjustment(entry) + getTimestampHours(timestamps);

    const handleNoteBlur = (e, entry) => {
        if (entry) {
            dispatch('UPDATE_TIME_ENTRY', {
                sys_id: entry.sys_id,
                data: {
                    note: e.target.value
                }
            })
        } else {
            const data = {
                date: date,
                project: project.sys_id,
                consultant: consultantId,
                project_stage_role: psr.sys_id,
                note: e.target.value,
                time_adjustment: 0
            };
            dispatch('INSERT_TIME_ENTRY', { data })
        }
    }


    const handleBlur = (e, entry, timestampHours = 0) => {
        let inputHours = 0;
        if (e.target.value) {
            // Set number of hours and round to nearest .25;
            inputHours = Number(e.target.value);
            if(inputHours % .25 !== 0){
                inputHours = Math.round(e.target.value / .25) * .25;
            }
        }
        const difference = inputHours - timestampHours;
        const differenceDur = {
            hours: Math.abs(Math.floor(difference)),
            minutes: Math.abs(Math.floor(60 * (difference % 1)))
        }

        const adjustment_direction = difference >= 0 ? 'add' : 'subtract';
        const stringDuration = "1970-01-01 " + stringifyDuration(differenceDur);

        if (entry) {
            dispatch('UPDATE_TIME_ENTRY', {
                data: {
                    time_adjustment: stringDuration,
                    adjustment_direction,
                    project_stage_role: psr.sys_id,
                },
                sys_id: entry.sys_id,
            })
        } else {
            const data = {
                adjustment_direction,
                time_adjustment: stringDuration,
                date: date,
                project: project.sys_id,
                consultant: consultantId,
                project_stage_role: psr.sys_id,
            };
            dispatch('INSERT_TIME_ENTRY', { data })
        }
    }

    return (
        <div className="duration-item">
            <input
                className={`project-item-hours ${isMissingNote(entry, hours) && "no-note"}`}
                type="number"
                value={hours > 0 ? hours : ''}
                min='0'
                max='24'
                step={0.25}
                on-keyup={(e) => enforceMinMax(e)}
                on-blur={(e) => editableInputs && handleBlur(e, entry)}
                disabled={!editableInputs}
                placeholder={0}
            />
            <div className={`hover-note ${index >= 4 && 'note-reverse'}`}>
                <textarea
                    value={getNoteValue(entry)}
                    on-blur={(e) => editableInputs && handleNoteBlur(e, entry)}
                    placeholder={editableInputs ? "Add your notes here..." : "No note recorded"}
                    readonly={!editableInputs}
                />
            </div>
        </div>
    )
}

export default RoleDay;