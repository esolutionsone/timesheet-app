import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import axios from 'axios';
import { getSnWeekBounds, buildProjectMap } from '../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD, FETCH_TIME_ENTRIES_PAYLOAD } from '../payloads';

const { COMPONENT_BOOTSTRAPPED } = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({ state, properties, dispatch, updateState }) => {
        console.log('WEEK VIEW BOOTSTRAPPED');        
        dispatch('WEEK_REFETCH');
    },
    'FETCH_WEEKLY_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_WEEKLY_TIMESTAMPS',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_WEEKLY_TIMESTAMPS': ({ state, action, updateState, properties }) => {
        console.log('Setting timestamps: action:', action);

        const { dailyEntries } = state;
        const projectMap = buildProjectMap(action.payload.result, dailyEntries)
        const clientMap = state.clientMap;
        const {genericProjects, projects} = properties;

        const allProjects = [...genericProjects, ...projects];
        const untrackedProjects = allProjects.filter(proj => {
            return !Array.from(projectMap.values())
                .map(p => p.sys_id)
                .includes(proj.sys_id)
        })

        // Include projects initialized from timestamps
        projectMap.forEach(proj => {
            proj.entries = [];

            if (clientMap.has(proj['client.sys_id'])) {
                clientMap.get(proj['client.sys_id']).projects.push(proj);
            } else {
                clientMap.set(proj['client.sys_id'], {
                    short_description: proj.client,
                    projects: [proj],
                    sys_id: proj['client.sys_id'],
                });
            }
        })

        // Include projects with no timestamps
        untrackedProjects.forEach(proj => {
            if(clientMap.has(proj.client.sys_id)){
                clientMap.get(proj.client.sys_id).projects.push(proj);
            }else{
                clientMap.set(proj.client.sys_id, {
                    short_description: proj.client.short_description,
                    projects: [proj],
                    sys_id: proj.client.sys_id,
                })
            }     
        })
        updateState({ projectMap: projectMap, clientMap: clientMap });
    },
    'FETCH_WEEKLY_TIME_ENTRIES': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_WEEKLY_TIME_ENTRIES',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_WEEKLY_TIME_ENTRIES': ({ action, state, properties, updateState, dispatch }) => {
        updateState({ dailyEntries: action.payload.result });
        const { selectedDay } = state;
        const { consultantId, timeEntryTable } = properties;
        dispatch('FETCH_WEEKLY_TIMESTAMPS',
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnWeekBounds(selectedDay))
        );
    },
    'WEEK_REFETCH': ({ dispatch, state, properties, updateState }) => {
        const { selectedDay } = state;
        const { consultantId, timeEntryTable } = properties;

        const [start_time, end_time] = getSnWeekBounds(selectedDay);

        const {sysparm_query, sysparm_fields} = FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnWeekBounds(selectedDay))
        const url = `${window.location.origin}/api/now/table/${encodeURI(timeEntryTable)}
            ?sysparm_query=consultant=${consultantId}&sysparm_fields=${encodeURIComponent(sysparm_fields)}
        `
        console.log(url);
        axios.get(url).then((res)=>console.log(res))
        // updateState({ clientMap: new Map() });
        // dispatch('FETCH_WEEKLY_TIME_ENTRIES',
        //     FETCH_TIME_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...getSnWeekBounds(selectedDay))
        // );
    },
    'UPDATE_TIME_ENTRY': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry/:sys_id', {
        method: 'PUT',
        pathParams: ['sys_id'],
        dataParam: 'data',
        successActionType: 'LOG_RESULT',
        errorActionType: 'LOG_ERROR',
    }),
    'INSERT_TIME_ENTRY': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry', {
        method: 'POST',
        dataParam: 'data',
        successActionType: 'LOG_RESULT',
        errorActionType: 'LOG_ERROR',
    })
} 