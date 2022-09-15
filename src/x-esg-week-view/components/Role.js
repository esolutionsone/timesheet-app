import ClientDay from './Role.js'

export const Role = ({ name, psr, entries, timestamps, dateArr }) => {
    console.log(entries, timestamps, dateArr);
    return (
        <div>
            <div>{name}</div>

            {dateArr.map(date => {
                return <ClientDay 
                    entries={entries}
                    timestamps={timestamps}
                    date={date}
                />
            })}

            
        </div>
    );
}