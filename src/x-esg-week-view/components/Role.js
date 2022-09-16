import ClientDay from './ClientDay.js';
import {format} from 'date-fns';

export const Role = (props) => {
    const { name, psr, entries, timestamps, dateArr, dispatch, consultantId } = props;
    // console.log('psr', psr)
    // console.log('role: ', psr.project_role.short_description);
    // console.log('psr.sys_id', psr.sys_id)
    // console.log('entries', entries)
    console.log(name, entries)
    return (
        <div className='role-project-grid' >
            <div className='role-item'>{name}</div>

            {dateArr.map(day => {
                const date = format(day, 'Y-MM-dd');
                const entry = entries.find(e => {
                    // console.log('comparison: ', e.project_stage_role.sys_id, ' = ' , psr.sys_id);
                    const match = e.date == date;
                    if(match) console.log('MATCH')
                    return match;
                });
                return <ClientDay
                    key={date}
                    date={date}
                    entry={entry}
                    timestamps={timestamps}
                    dispatch={dispatch}
                    consultantId={consultantId}
                    psr={psr}
                />
            })}

            
        </div>
    );
}