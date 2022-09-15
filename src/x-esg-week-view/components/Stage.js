import { Role } from "./Role";

export const Stage = (props) => {
    const { psrs, name, entries, timestamps, dateArr } = props;
    const roleIds = [...new Set(psrs.map(role => role.project_role.sys_id))];


    return (
        <div >
            <pre>{name}</pre>
            {psrs.map(psr => {
                console.log('psr (role) => ', psr)
                console.log('entries => ', entries)
                const roleEntries = entries.filter(e => e.project_stage_role.sys_id == psr.sys_id)
                return (
                    <Role
                        {...props}
                        psr={psr}
                        name={psr.project_role.short_description}
                        entries={roleEntries}
                        timestamps={timestamps}
                        dateArr={dateArr}
                    />
                )
            })}
        </div>
    );
}