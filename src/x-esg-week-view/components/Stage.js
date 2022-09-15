import { Role } from "./Role";

export const Stage = (props) => {
    const { psrs, name, entries, timestamps, dateArr } = props;
    const roleIds = [...new Set(psrs.map(role => role.project_role.sys_id))]

    return (
        <div >
            <pre>{name}</pre>
            {psrs.map(psr => {
                return (
                    <Role
                        {...props}
                        psr={psr}
                        name={psr.project_role.short_description}
                        entries={entries}
                        timestamps={timestamps}
                        dateArr={dateArr}
                    />
                )
            })}
        </div>
    );
}