import ClientDay from './ClientDay.js';
import {format} from 'date-fns';

export const Role = (props) => {
    const { name, psr, entries, timestamps, dateArr, dispatch, consultantId } = props;
    return (
        <div>
            <div>{name}</div>

            {dateArr.map(day => {
                const date = format(day, 'Y-MM-dd');
                const entry = entries.find(e => e.date == date);
                return <ClientDay
                    key={date}
                    date={date}
                    entry={entry}
                    timestamps={timestamps}
                    dispatch={dispatch}
                    consultantId={consultantId}
                />
            })}

            
        </div>
    );
}