import ClientDay from './ClientDay.js';
import {format} from 'date-fns';

export const Role = (props) => {
    const { name, entries, dateArr } = props;
    
    return (
        <div className='role-project-grid' >
            <div className='role-item'>{name}</div>

            {dateArr.map(day => {
                const date = format(day, 'Y-MM-dd');
                const entry = entries.find(e => e.date == date);
                return <ClientDay
                    {...props}
                    key={date}
                    date={date}
                    entry={entry}
                />
            })}  
        </div>
    );
}