import {format, formatDistanceToNow, min} from 'date-fns';
import { msToString, hhmmToSnTime, getUTCTime, toSnTime } from '../../x-esg-timer-button/helpers';

export const Timestamp = ({stamp}) => {
    const {note, start_time, end_time, active, sys_id} = stamp;                                     
    const localTimes = {start: format(getUTCTime(start_time), 'HH:mm')}

    localTimes.end = end_time ? format(getUTCTime(end_time), 'HH:mm') : 'now';
    return (
        <div className="remove-timestamp">
            <div 
                className="timestamp-note"
                on-click={() => updateState({editableTimestamp: sys_id})}
            >
                {editableTimestamp == sys_id ? 
                    <span>
                        <input 
                            type="text"
                            placeholder="What are doing right now?"
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