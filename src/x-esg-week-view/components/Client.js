import {format} from 'date-fns';
import { getUTCTime, stringifyDuration } from '../../helpers';

export const Client = ({client, dateArr, dispatch}) => {
    console.log('Client', client)

    const projectList = client.projects;

    const handleBlur = (e, timestampHours, todayEntry) => {
        const inputHours = Number(e.target.value);
        const difference = inputHours - timestampHours;

        const adjustment_direction = difference >= 0 ? 'add' : 'subtract';
        const stringDuration = "1970-01-01 " + stringifyDuration({hours: Math.abs(difference)});

        if(todayEntry){
            dispatch('UPDATE_TIME_ENTRY', {
                data: {
                    time_adjustment: stringDuration,
                    submitted_note: 'changed',
                    adjustment_direction,
                },
                sys_id: todayEntry.sys_id,   
            })
        }
    }

    return (
        <div className="client-container">
            <span className="client-name">{client.short_description}</span>
            <div>
                {projectList.map(project => {
                    return (
                        <div className="project-item week-view-grid">
                            <div className="project-item-title">{project.short_description}</div>
                           
                            {dateArr.map(day => {
                                const date = format(day, 'Y-MM-dd')
                                const todayEntry = project.time_entries ? 
                                    project.time_entries
                                        .find(e => e.date == date)
                                        : 
                                        null;

                                console.log('date:', date, 'todayEntry', todayEntry)
                                if(!todayEntry && !project.timestamps){
                                    return <input className="project-item-time" type="number" />
                                }else{
                                    console.log('FOUND ONE')
                                    console.log(project.timestamps)
                                    const timestampHours = project.timestamps
                                        .filter(stamp => {
                                            return stamp.rounded_duration !== '' 
                                                && stamp.start_time.split(' ')[0] == date;
                                        })
                                        .reduce((acc, stamp) => {
                                            return acc + getUTCTime(stamp.rounded_duration).getTime();
                                        }, 0) / 1000 / 60 / 60;

                                    // Add time adjustment from timeEntry
                                    let timeAdjustment = 0;
                                    if(todayEntry){
                                        timeAdjustment = getUTCTime(todayEntry.time_adjustment).getTime();
                                        timeAdjustment = timeAdjustment / 1000 / 60 / 60;
                                        timeAdjustment *= todayEntry.adjustment_direction == 'add' 
                                            ? 1 : -1;
                                    }
                                    console.log('timeAdjustment', timeAdjustment);
                                    return <input 
                                        className="project-item-time" 
                                        type="number" 
                                        value={timestampHours + timeAdjustment}
                                        on-blur={(e) => handleBlur(e, timestampHours, todayEntry)}   
                                    />   
                                }     
                            })}                
                        </div>
                    );
                })}
            </div>
        </div>
    );
}