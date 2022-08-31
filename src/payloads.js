export const FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD = (consultantId, start_time, end_time) => ({
    tableName: 'x_esg_one_delivery_timestamp',
    sysparm_query: (start_time && end_time) ?
        `user=${consultantId}^start_time>${start_time}^start_time<${end_time}
        ^ORDERBYstart_time`
        :
        `user=${consultantId}^start_timeONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYstart_time`,
    sysparm_fields: `project.client.short_description, project.sys_id, project.short_description, start_time,end_time,active,duration,rounded_duration,sys_id,note`
})