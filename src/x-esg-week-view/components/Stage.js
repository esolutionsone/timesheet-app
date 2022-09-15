import { Role } from "./Role";

export const Stage = ({ psrs, name }) => {

    const roleIds = [...new Set(psrs.map(role => role.project_role.sys_id))]

    return (
        <div >
            <pre>{name}</pre>
            {roleIds.map(sys_id => {
                let filteredPsrs = psrs.filter(psr => {
                    return sys_id === psr.project_role.sys_id
                })
                return (
                    <Role
                        psrs={filteredPsrs}
                        name={filteredPsrs[0].project_role.short_description}
                    />
                )
            })}
        </div>
    );
}