import RoleDay from './RoleDay.js';
import {format} from 'date-fns';

export const Role = (props) => {
    const { name, entries, dateArr } = props;
    
    return (
        <div className='role-project-grid' >
            <div className='role-item'>{name}</div>

            {dateArr.map((day, i) => {
                const date = format(day, 'Y-MM-dd');
                const entry = entries.find(e => e.date == date);
                return <RoleDay
                    {...props}
                    key={date}
                    date={date}
                    entry={entry}
                    index={i}
                />
            })}  
        </div>
    );
}