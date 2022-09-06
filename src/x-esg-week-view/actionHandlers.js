import {actionTypes} from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { getSnDayBounds, getSnWeekBounds, buildProjectMap } from '../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD, FETCH_TIME_ENTRIES_PAYLOAD } from '../payloads';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({state, properties, dispatch}) => {
        const {selectedDay} = state;
        const {consultantId, timeEntryTable} = properties;
        
        dispatch('FETCH_WEEKLY_TIME_ENTRIES', 
            FETCH_TIME_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...getSnWeekBounds(selectedDay))
        );
    },
    'FETCH_WEEKLY_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_WEEKLY_TIMESTAMPS',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_WEEKLY_TIMESTAMPS': ({state, action, updateState, dispatch}) => {
        console.log('Setting timestamps: action:', action);

        const {dailyEntries} = state;
        const projectMap = buildProjectMap(action.payload.result, dailyEntries)
        const clientMap = state.clientMap;
        projectMap.forEach(proj => {
            proj.entries = [];
            if(clientMap.has(proj['client.sys_id'])){
                clientMap.get(proj['client.sys_id']).projects.push(proj);
            }else{
                clientMap.set(proj['client.sys_id'], {
                    short_description: proj.client,
                    projects: [proj],
                    sys_id: proj['client.sys_id'],
                });
            }
        })
        updateState({projectMap: projectMap, clientMap: clientMap});
    },
    'FETCH_WEEKLY_TIME_ENTRIES': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_WEEKLY_TIME_ENTRIES',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_WEEKLY_TIME_ENTRIES': ({action,state, properties, updateState, dispatch}) => {
        updateState({dailyEntries: action.payload.result});
        const {selectedDay} = state;
        const {consultantId, timeEntryTable} = properties;
        dispatch('FETCH_WEEKLY_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnWeekBounds(selectedDay))
        );
    },
    'UPDATE_CLIENT_MAP': ({action, state, updateState}) => {
        // console.log(action.payload.result);
        // const clientMap = state.clientMap;

        // for(let entry of action.payload.result){

        //     if(clientMap.has(entry['project.client.sys_id'])){
        //         const client = clientMap.get(entry['project.client.sys_id'])
        //         const project = client.projects.find(proj => {
        //             return entry['project.sys_id'] == proj.sys_id;
        //         });

        //         if(project){
        //             project.entries.push(entry);
        //         }else{
        //             client.projects.push({
        //                 sys_id: entry['project.sys_id'],
        //                 entries: [entry],
        //             })
        //         }
        //     }else{
        //         clientMap.set(entry['project.client.sys_id'], {
        //             projects: []
        //         })
        //     }
        // }
    }
} 