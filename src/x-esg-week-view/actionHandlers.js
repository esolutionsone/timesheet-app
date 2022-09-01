import {actionTypes} from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { getSnDayBounds, getSnWeekBounds, buildProjectMap } from '../helpers';
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

        const projectMap = buildProjectMap(action.payload.result)
        const clientMap = new Map();
        projectMap.forEach(proj => {
            if(clientMap.has(proj['client.sys_id'])){
                console.log('pushing')
                clientMap.get(proj['client.sys_id']).projects.push(proj);
            }else{
                console.log('setting');
                clientMap.set(proj['client.sys_id'], {
                    short_description: proj.client,
                    projects: [proj]
                });
            }
        })
        updateState({projectMap: projectMap, clientMap: clientMap});
    },
}