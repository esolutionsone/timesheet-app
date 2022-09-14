

export const Role = ({psrs}) => {
    const roleIds = [...new Set(psrs.map(role => role.project_role.project.sys_id))]
    console.log('all clients', roleIds);

    return (
        <div>
            {/* {roleIds.map(sys_id => {
                let filteredPsrs = psrs.find(psr => {
                    console.log(psr.project_role.sys_id);
                    return sys_id === psr.project_role.sys_id
                })
                return (
                    <div>{filteredPsrs[0]}</div>
                );
            })} */}
            {psrs.map(psr => {
                return (
                    <div>{psr.project_role.short_description}</div>
                )
            })}
        </div>
    );
}