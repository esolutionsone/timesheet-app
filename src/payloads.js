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
    sysparm_query: `consultant=${consultantId}^start_time>${start_time}^start_time<${end_time}
    ^ORDERBYstart_time`
})