import { getUTCTime, stringifyDuration } from "../../helpers";

const ClientDay = ({
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
    const note = todayEntry ? todayEntry.note : '';
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

    const handleBlur = (e, timestampHours = 0, todayEntry) => {
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

    if (!todayEntry) {
        if (editableInputs) {
            return <div className="duration-item">
                <input
                    className={`project-item-time`}
                    type="number"
                    value={0}
                    min='0'
                    max='24'
                    on-keyup={(e) => enforceMinMax(e)}
                    on-blur={(e) => handleBlur(e)}
                />
                <div className={`hover-note ${index >= 4 && 'note-reverse'}`}>
                    <textarea
                        value={note}
                        on-blur={(e) => handleNoteBlur(e)}
                        placeholder="Add your notes here..."
                    />
                </div>
            </div>
        } else {
            return (
                <div className="duration-item">
                    <div>0</div>
                    <div className={`hover-note ${index >= 5 && 'note-reverse'}`}>
                        <textarea
                            value=''
                            placeholder="No note was recorded"
                            readonly
                        />
                    </div>
                </div>
            );
        }
    } else {
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

        const noNote = timestampHours + timeAdjustment > 0 && todayEntry.note === '';

        if (editableInputs) {
            return (
                <div className="duration-item">
                    <input
                        className={`project-item-time ${noNote && 'no-note'}`}
                        type="number"
                        value={timestampHours + timeAdjustment}
                        min='0'
                        max='24'
                        on-keyup={(e) => enforceMinMax(e)}
                        on-blur={(e) => handleBlur(e, timestampHours, todayEntry)}
                    />
                    <div className={`hover-note ${index >= 5 && 'note-reverse'}`}>
                        <textarea
                            value={note}
                            on-blur={(e) => handleNoteBlur(e, todayEntry)}
                            placeholder="Add your notes here..."
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="duration-item">
                    <div>{timestampHours + timeAdjustment}</div>
                    <div className={`hover-note ${index >= 5 && 'note-reverse'}`}>
                        <textarea
                            value={note}
                            placeholder="No note was recorded"
                            readonly
                        />
                    </div>
                </div>
            );
        }
    }
}

export default ClientDay;