import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import '../../x-esg-timer-button';
import {format, formatDistanceToNow, min} from 'date-fns';
import { msToString, hhmmToSnTime, getUTCTime, toSnTime } from '../../x-esg-timer-button/helpers';
import WebFont from 'webfontloader';


export const ProjectItem = (projectList, state) => {
    WebFont.load({
        google: {
            families: [
                'Montserrat:400,500,600,700', 
                'Material+Symbols+Outlined', 
                'Material+Symbols+Rounded'
            ]
        }
    })

    console.log('projectList', projectList);
    console.log('fdsaf');
    
    

    return (
        <Fragment>
            {projectList.map(proj => {
                const {
                        client, 
                        short_description, 
                        sys_id, 
                        active, 
                        timestamps, 
                        note
                    } = proj;
                const latestActive = timestamps.find(stamp => stamp.active === "true");
                return (
                    <div className="project-item" key={sys_id}>
                        <div className="client-name">{client}</div>
                        <div className="project-title-container">
                            <div className="project-title">{short_description}</div>
                            <div className="project-start-stop-container">
                                {<x-esg-timer-button 
                                    projectData={proj}
                                    active={active}
                                    start={latestActive ? latestActive.start_time : null}
                                    loadFonts={false}
                                    sysId={latestActive ? latestActive.sys_id : null}
                                />}

                            <div>{msToString(projectMap.get(sys_id).totalRoundedTime)}</div>
                                {!editMode ? 
                                    '' 
                                    : 
                                    <span 
                                        className="material-symbols-rounded remove-project"
                                        on-click={(e) => handleDeleteProject(e, proj)}
                                    >
                                        delete_forever
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="project-notes">
                            {timestamps.map(stamp => {
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
                            })}
                        </div>
                    </div>
                );
            })}
        </Fragment>
    );
}

