import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import axios from 'axios';
import { getSnWeekBounds, buildProjectMap, unflatten } from '../helpers';
import { 
        FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD, 
        FETCH_ENTRIES_PAYLOAD, 
        FETCH_PROJECT_STAGE_ROLE_PAYLOAD, 
        FETCH_TIMESTAMPS_PAYLOAD, 
        FETCH_TIME_ENTRIES_PAYLOAD } from '../payloads';

const { COMPONENT_BOOTSTRAPPED } = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({ state, properties, dispatch, updateState }) => {
        const { consultantId } = state.properties;

        console.log('WEEK VIEW BOOTSTRAPPED');     
        dispatch('FETCH_PROJECT_STAGE_ROLE', FETCH_PROJECT_STAGE_ROLE_PAYLOAD(consultantId))
        dispatch('WEEK_REFETCH');
    },
    // NEW STUFF BELOW
    'FETCH_PROJECT_STAGE_ROLE':  createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_PROJECT_STAGE_ROLE',
        errorActionType: 'LOG_ERROR'
    }),
    'SET_PROJECT_STAGE_ROLE': ({action, updateState}) => {
        console.log('####### SET_PROJECT_STAGE_ROLE #######', action.payload.result);
        updateState({project_stage_roles: action.payload.result.map(obj => unflatten(obj))})
    },
    'FETCH_ENTRIES': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'FETCH_ENTRIES_SUCCESS',
        errorActionType: 'LOG_ERROR',
    }),
    'FETCH_ENTRIES_SUCCESS': ({action, updateState}) => updateState({entries: action.payload.result.map(obj => unflatten(obj))}),
    'FETCH_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'FETCH_TIMESTAMPS_SUCCESS',
        errorActionType: 'LOG_ERROR',
    }),
    'FETCH_TIMESTAMPS_SUCCESS': ({action, updateState}) => updateState({timestamps: action.payload.result.map(obj => unflatten(obj))}),
    // END NEW STUFF
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
    'WEEK_REFETCH': async ({ dispatch, state, properties, updateState }) => {
        const { selectedDay } = state;
        const { consultantId, timeEntryTable, timestampTable } = properties;

        const {sysparm_query, sysparm_fields} = FETCH_TIME_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...getSnWeekBounds(selectedDay))
        const url = `api/now/table/${timeEntryTable}?sysparm_query=${encodeURIComponent(sysparm_query)}&sysparm_fields=${encodeURIComponent(sysparm_fields)}`

        const bounds = getSnWeekBounds(selectedDay);
        //New entries fetch
        dispatch('FETCH_ENTRIES', FETCH_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...bounds));
        dispatch('FETCH_TIMESTAMPS', FETCH_TIMESTAMPS_PAYLOAD(consultantId, timestampTable, ...bounds))


        // Get the time entries first
        axios.get(url)
            .then(entries => {
                console.log('TIME ENTRIES:', entries);

                const {sysparm_query, sysparm_fields} = FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnWeekBounds(selectedDay));
                const url = `api/now/table/${timestampTable}?sysparm_query=${encodeURIComponent(sysparm_query)}&sysparm_fields=${encodeURIComponent(sysparm_fields)}`

                axios.get(url)
                    .then(stamps => {
                        console.log('stamps', stamps);

                        const dailyEntries = entries.data.result;
                        const projectMap = buildProjectMap(stamps.data.result, dailyEntries)
                        const clientMap = new Map();
                        const {genericProjects, projects} = properties;
                
                        const allProjects = [...genericProjects, ...projects];

                        console.log('ALL PROJECTS', allProjects)
                        const untrackedProjects = allProjects.filter(proj => {
                            return !Array.from(projectMap.values())
                                .map(p => p.sys_id)
                                .includes(proj.sys_id)
                        })
                
                        // Include projects initialized from timestamps

                        console.log('projectMap', projectMap);
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

                        dispatch('SET_WEEK_STATE', {projectMap, clientMap, dailyEntries});
                        // dispatch('SET_LOADING', {loading: false})
                        console.log('clientMap', clientMap)
                        // updateState({ projectMap: projectMap, clientMap: clientMap, dailyEntries: dailyEntries });
                    })
            })

        //     // .then((res)=>console.log(res))
        // updateState({ clientMap: new Map() });
        // dispatch('FETCH_WEEKLY_TIME_ENTRIES',
        //     FETCH_TIME_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...getSnWeekBounds(selectedDay))
        // );
    },
    'SET_WEEK_STATE': ({action, updateState}) => updateState(action.payload),

    //NOT WORKING
    // api/now/tablex_esg_one_delivery_timestamp?sysparm_query=consultant%3D9fc870221b959d50c9df43b8b04bcb8c%5Estart_time%3E2022-09-05%2005%3A00%3A00%5Estart_time%3C2022-09-12%2005%3A00%3A00%0A%20%20%20%20%20%20%20%20%5EORDERBYstart_time&sysparm_fields=project.client.short_description%2C%20project.client.sys_id%2C%20project.sys_id%2C%20project.short_description%2C%20start_time%2Cend_time%2Cactive%2Cduration%2Crounded_duration%2Csys_id%2Cnote
    // api/now/table/x_esg_one_delivery_timestamp?sysparm_query=consultant%3D9fc870221b959d50c9df43b8b04bcb8c%5Estart_time%3E2022-09-05%2005%3A00%3A00%5Estart_time%3C2022-09-12%2005%3A00%3A00%0A%20%20%20%20%20%20%20%20%5EORDERBYstart_time&sysparm_fields=project.client.short_description%2C%20project.client.sys_id%2C%20project.sys_id%2C%20project.short_description%2C%20start_time%2Cend_time%2Cactive%2Cduration%2Crounded_duration%2Csys_id%2Cnote
    'UPDATE_TIME_ENTRY': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry/:sys_id', {
        method: 'PUT',
        pathParams: ['sys_id'],
        dataParam: 'data',
        successActionType: 'WEEK_REFETCH',
        errorActionType: 'LOG_ERROR',
    }),
    'INSERT_TIME_ENTRY': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry', {
        method: 'POST',
        dataParam: 'data',
        successActionType: 'WEEK_REFETCH',
        errorActionType: 'LOG_ERROR',
    })
} 