import { getUTCTime, stringifyDuration } from "../../helpers";

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
    const todayEntry = entry;
    const editableInputs = entryState === 'draft' && selectedDay <= today;

    const handleNoteBlur = (e, todayEntry) => {
        if (todayEntry) {
            dispatch('UPDATE_TIME_ENTRY', {
                sys_id: todayEntry.sys_id,
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
            };
            dispatch('INSERT_TIME_ENTRY', { data })
        }
    }

    const enforceMinMax = (e) => {
        if (e.target.value > 24) {
            e.target.value = 24;
        }
    }

    const handleBlur = (e, todayEntry, timestampHours = 0) => {
        let inputHours = 0;
        if (e.target.value) {
            inputHours = Number(e.target.value);
        }
        const difference = inputHours - timestampHours;
        const differenceDur = {
            hours: Math.abs(Math.floor(difference)),
            minutes: Math.abs(Math.floor(60 * (difference % 1)))
        }

        const adjustment_direction = difference >= 0 ? 'add' : 'subtract';
        const stringDuration = "1970-01-01 " + stringifyDuration(differenceDur);

        if (todayEntry) {
            dispatch('UPDATE_TIME_ENTRY', {
                data: {
                    time_adjustment: stringDuration,
                    adjustment_direction,
                    project_stage_role: psr.sys_id,
                },
                sys_id: todayEntry.sys_id,
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

    const getTimestampHours = () => {
        // set the timestamp hours for the project if they exist
        let timestampHours = 0
        if (timestamps) {
            timestampHours = timestamps
                //filter by stamps matching date
                .filter(stamp => {
                    return stamp.rounded_duration !== ''
                        && stamp.start_time.split(' ')[0] == date;
                })
                // reduce on time, and convert to hours
                .reduce((acc, stamp) => {
                    return acc + getUTCTime(stamp.rounded_duration).getTime();
                }, 0) / 1000 / 60 / 60;
        }

        return timestampHours;
    }

    const getTimeAdjustment = () => {
        // Add time adjustment from timeEntry
        let timeAdjustment = 0;
        if (todayEntry) {
            if (todayEntry.time_adjustment) {
                timeAdjustment = getUTCTime(todayEntry.time_adjustment).getTime();
            }
            timeAdjustment = timeAdjustment / 1000 / 60 / 60;
            timeAdjustment *= (todayEntry.adjustment_direction == 'add')
                ? 1 : -1;
        }
        return timeAdjustment;
    }

    const getNoteValue = () => {
        if(!todayEntry || !todayEntry.note) return '';
        return todayEntry.note;
    }

    const isMissingNote = () => {
        // Check for entry, non-zero hours, and lack of note
        if(!todayEntry) return false;
        if(getTimeAdjustment() + getTimestampHours() === 0)return false;
        if(todayEntry.note) return false;
        return true;
    }

    return (
        <div className="duration-item">
            <input
                className={`project-item-time ${isMissingNote() && "no-note"}`}
                type="number"
                value={getTimeAdjustment() + getTimestampHours()}
                min='0'
                max='24'
                step='.25'
                on-keyup={(e) => enforceMinMax(e)}
                on-blur={(e) => editableInputs && handleBlur(e, todayEntry)}
                disabled={!editableInputs}
            />
            <div className={`hover-note ${index >= 4 && 'note-reverse'}`}>
                <textarea
                    value={getNoteValue()}
                    on-blur={(e) => editableInputs && handleNoteBlur(e, todayEntry)}
                    placeholder={editableInputs ? "Add your notes here..." : "No note recorded"}
                    readonly={!editableInputs}
                />
            </div>
        </div>
    )
}

export default RoleDay;