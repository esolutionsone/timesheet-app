import { hhmmToSnTime, getUTCTime, toSnTime, getSnDayBounds } from '../../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD, FETCH_TIME_ENTRIES_FOR_DELETE_PAYLOAD } from '../../payloads';
import { format } from 'date-fns';

export const Timestamp = ({ 
                            stamp, 
                            editableTimestamp, 
                            editMode, 
                            dispatch,
                            timestampTable,
                            consultantId,
                            selectedDay, 
                            timeEntryTable,
                            timestampLength}) => {

    const {note, start_time, end_time, sys_id} = stamp;                                     
    const localTimes = {start: format(getUTCTime(start_time), 'HH:mm')}

    localTimes.end = end_time ? format(getUTCTime(end_time), 'HH:mm') : 'now';

    const handleDeleteTimestamp = (e, sys_id) => {
        e.preventDefault();
        
        if (confirm("Click OK to remove this timestamp") == true) {

            if(timestampLength == 1) {
                dispatch('FETCH_TIME_ENTRIES_FOR_DELETE', FETCH_TIME_ENTRIES_FOR_DELETE_PAYLOAD(consultantId, timeEntryTable, stamp['project.sys_id']))
            }
                
            dispatch('DELETE_PROJECT_TIMESTAMPS', {
                tableName: timestampTable,
                id: sys_id,
            });

            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(selectedDay)));
        } 
    }

    const handleUpdateTimestamp = (sys_id, data, timeToCheck) => {
        let timeNow = new Date();

        if (data.end_time && (data.end_time < timeToCheck)) {
            dispatch('TIMER_CONTAINER#UPDATE_STATE', {editableTimestamp: ''})
            alert('End time cannot be earlier than start time.');
            return 
        } else if (data.end_time > toSnTime(timeNow)) {
            dispatch('TIMER_CONTAINER#UPDATE_STATE', {editableTimestamp: ''})
            alert('End time cannot be later than current time.');
            return
        } else if (data.start_time && timeToCheck && (data.start_time > timeToCheck)) {
            dispatch('TIMER_CONTAINER#UPDATE_STATE', {editableTimestamp: ''})
            alert('Start time cannot be later than end time.');
            return
        } 
        else if (data.start_time && (data.start_time > toSnTime(timeNow))) {
            dispatch('TIMER_CONTAINER#UPDATE_STATE', {editableTimestamp: ''})
            alert('Start time cannot be later than current time.');
            return
        }

        dispatch('UPDATE_TIMESTAMP', {
            tableName: 'x_esg_one_delivery_timestamp',
            sys_id,
            data,
        })
        dispatch('TIMER_CONTAINER#UPDATE_STATE', {editableTimestamp: ''})
    }

    return (
        <div className="remove-timestamp">
            <div 
                className="timestamp-note"
                on-click={() => dispatch('TIMER_CONTAINER#UPDATE_STATE', {editableTimestamp: sys_id})}
            >
                {editableTimestamp == sys_id ? 
                    <span>
                        <input 
                            type="text"
                            placeholder="What are you doing right now?"
                            value={note}
                            on-change={(e)=>handleUpdateTimestamp(sys_id, {note: e.target.value})}
                            on-blur={(e)=>handleUpdateTimestamp(sys_id, {note: e.target.value})}
                            on-keydown={(e)=> e.key === 'Enter' && handleUpdateTimestamp(sys_id, {note: e.target.value})}
                        >{note}</input>
                    </span> 
                    : 
                    <span>{note || '[Add note]'}</span>
                }

                {editableTimestamp == sys_id ?
                    <span className="timestamp-times">
                        <input 
                            id="edit-time-start"
                            type="time" 
                            value={localTimes.start}
                            on-blur={(e)=>handleUpdateTimestamp(sys_id, {start_time: hhmmToSnTime(e.target.value)}, end_time)}
                            on-keydown={(e)=> e.key === 'Enter' && e.target.blur()}
                    />
                    {end_time && <span> - </span>}
                        {!end_time ? '' : 
                            <input 
                                id="edit-time-end"
                                type="time" 
                                value={localTimes.end}
                                min={localTimes.start}
                                on-blur={(e)=>handleUpdateTimestamp(sys_id, {end_time: hhmmToSnTime(e.target.value)}, start_time)}
                                on-keydown={(e)=> e.key === 'Enter' && e.target.blur()}
                        />}
                    </span>
                    :
                    <span className="timestamp-times">{localTimes.start} - {localTimes.end}</span>          
                }
                
            </div>
            {!editMode ? 
                ''
                :
                <span 
                    className="remove-timestamp-icon material-symbols-outlined"
                    on-click={(e)=> handleDeleteTimestamp(e, sys_id)}>
                    disabled_by_default
                </span>
            }
        </div>
    );
}