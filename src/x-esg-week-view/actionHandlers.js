import {actionTypes} from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { getSnDayBounds, getSnWeekBounds } from '../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../payloads';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({state, properties, dispatch}) => {
        const {selectedDay} = state;
        const {consultantId} = properties;
        console.log(FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, getSnWeekBounds(selectedDay)))
        dispatch('FETCH_WEEKLY_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, getSnWeekBounds(selectedDay))
        );
    },
    'FETCH_WEEKLY_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        startActionType: 'TEST_START',
        successActionType: 'SET_WEEKLY_TIMESTAMPS',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_WEEKLY_TIMESTAMPS': ({action, updateState}) => {
        console.log('Setting timestamps: action:', action);
        const timestamps = action.payload.result;
        const stampsByProject = new Map();
        
        // Massage for easy mapping
        // Subtracting the parsed ServiceNow zero duration time with 
        // Date.parse("1970-01-01 00:00:00") corrects for timezone issues, etc.
        for(let stamp of timestamps){
            const projectId = stamp['project.sys_id'];
            const active = stamp.active === 'true';

            const sharedValues = {
                active,
                sys_id: projectId,
                note: stamp.note,
                client: stamp['project.client.short_description'],
                short_description: stamp['project.short_description'],
            }
            if(stampsByProject.has(projectId)){
                stampsByProject.set(projectId, {
                    ...sharedValues,
                    timestamps: [stamp, ...stampsByProject.get(projectId).timestamps],
                    totalRoundedTime: stampsByProject.get(projectId).totalRoundedTime + 
                        (Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") 
                        || 0),
                });
            } else{
                stampsByProject.set(projectId, {
                    ...sharedValues,
                    timestamps: [stamp],
                    totalRoundedTime: Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") || 0,
                })
            }
        }
        updateState({projectMap: stampsByProject});
    },
}