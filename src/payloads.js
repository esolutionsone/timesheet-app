export const FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD = (consultantId, start_time, end_time) => ({
    tableName: 'x_esg_one_delivery_timestamp',
    sysparm_query: (start_time && end_time) ?
        `consultant=${consultantId}^start_time>${start_time}^start_time<${end_time}
        ^ORDERBYstart_time`
        :
        `consultant=${consultantId}^start_timeONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYstart_time`,
    sysparm_fields: `project.client.short_description, project.client.sys_id, project.sys_id, project.short_description, start_time,end_time,active,duration,rounded_duration,sys_id,note`
})

export const FETCH_TIME_ENTRIES_PAYLOAD = (consultantId, tableName, start_time, end_time) => ({
    tableName,
    sysparm_query: `consultant=${consultantId}^date>${start_time}^date<${end_time}
    ^ORDERBYstart_time`,
    sysparm_fields: 'date,sys_id,time_adjustment, project.sys_id, project.short_description, project.client.sys_id, project.client.short_description, adjustment_direction'
})

export const FETCH_PROJECT_STAGE_ROLE_PAYLOAD = (consultantId) => ({
    tableName: 'x_esg_one_core_project_stage_role',
    sysparm_query: `project_role.consultant_assigned=${consultantId}`,
    sysparm_fields: 'sys_id, used_hours, project_role.short_description, project_role.project.short_description, project_role.project.sys_id, roject_role.project.client.sys_id, project_role.project.client.short_description, project_stage.sys_id, project_stage.name '
})