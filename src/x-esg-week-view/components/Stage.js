import { Role } from "./Role";

export const Stage = (props) => {
    const { psrs, name, entries, timestamps } = props;
    const roleIds = [...new Set(psrs.map(role => role.project_role.sys_id))];


    return (
        <div >
            <div className='stage-item'>{name}</div>
            {psrs.map(psr => {
                
                const roleEntries = entries
                    .filter(e => e.project_stage_role.sys_id == psr.sys_id)
                const roleTimestamps = timestamps
                    .filter(stamp => stamp.project_stage_role.sys_id == psr.sys_id);
                
                return (
                    <Role
                        {...props}
                        psr={psr}
                        name={psr.project_role.short_description}
                        entries={roleEntries}
                        timestamps={roleTimestamps}
                    />
                )
            })}
        </div>
    );
}