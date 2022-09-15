

export const Role = ({psr}) => {
    console.log('current Role', psr.project_role.short_description);
    return (
        <div>
            <div>{psr.project_role.short_description}</div>
        </div>
    );
}