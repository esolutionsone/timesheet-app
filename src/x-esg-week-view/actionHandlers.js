import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { getSnWeekBounds, unflatten } from '../helpers';
import { 
        FETCH_ENTRIES_PAYLOAD, 
        FETCH_PROJECT_STAGE_ROLE_PAYLOAD, 
        FETCH_TIMESTAMPS_PAYLOAD, 
        FETCH_TIME_ENTRIES_PAYLOAD } from '../payloads';

const { COMPONENT_BOOTSTRAPPED } = actionTypes;
// const {DEBOUNCE, TAKE_LATEST} = modifierTypes

export default {
    [COMPONENT_BOOTSTRAPPED]: ({ state, properties, dispatch, updateState }) => {
        const { consultantId } = state.properties;

        console.log('WEEK VIEW BOOTSTRAPPED');     
        dispatch('FETCH_PROJECT_STAGE_ROLE', FETCH_PROJECT_STAGE_ROLE_PAYLOAD(consultantId))
        dispatch('WEEK_REFETCH');
    },
    'FETCH_PROJECT_STAGE_ROLE':  createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_PROJECT_STAGE_ROLE',
        errorActionType: 'LOG_ERROR'
    }),
    'SET_PROJECT_STAGE_ROLE': ({action, updateState}) => {
        updateState({project_stage_roles: action.payload.result.map(obj => unflatten(obj))})
    },
    'FETCH_ENTRIES': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'FETCH_ENTRIES_SUCCESS',
        errorActionType: 'LOG_ERROR',
    }),
    'FETCH_ENTRIES_SUCCESS': ({action, updateState}) => {
        updateState({entries: action.payload.result.map(obj => unflatten(obj))})
    },
    'FETCH_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'FETCH_TIMESTAMPS_SUCCESS',
        errorActionType: 'LOG_ERROR',
    }),
    'FETCH_TIMESTAMPS_SUCCESS': ({action, updateState}) =>{
        updateState({timestamps: action.payload.result.map(obj => unflatten(obj))})
    },
    'WEEK_REFETCH': async ({ dispatch, state, properties, updateState }) => {
        console.log('week refetch');
        const { selectedDay } = state;
        const { consultantId, timeEntryTable, timestampTable } = properties;

        const {sysparm_query, sysparm_fields} = FETCH_TIME_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...getSnWeekBounds(selectedDay))
        // const url = `api/now/table/${timeEntryTable}?sysparm_query=${encodeURIComponent(sysparm_query)}&sysparm_fields=${encodeURIComponent(sysparm_fields)}`

        const bounds = getSnWeekBounds(selectedDay);
        //New entries fetch
        dispatch('FETCH_ENTRIES', FETCH_ENTRIES_PAYLOAD(consultantId, timeEntryTable, ...bounds));
        dispatch('FETCH_TIMESTAMPS', FETCH_TIMESTAMPS_PAYLOAD(consultantId, timestampTable, ...bounds))

    },
    'SET_WEEK_STATE': ({action, updateState}) => updateState(action.payload),
    'UPDATE_TIME_ENTRY': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry/:sys_id', {
        method: 'PUT',
        pathParams: ['sys_id'],
        dataParam: 'data',
        successActionType: 'WEEK_REFETCH',
        errorActionType: 'LOG_ERROR',
    }),
    'UPDATE_SUBMIT': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry/:sys_id', {
        method: 'PUT',
        pathParams: ['sys_id'],
        dataParam: 'data',
        successActionType: 'LOG_LATEST',
        errorActionType: 'LOG_ERROR',
    }),
    'LOG_LATEST': { 
        modifier: {name: 'debounce', delay: 600},
        effect ({dispatch}) {
            dispatch('WEEK_REFETCH')
        }
    },
    'INSERT_TIME_ENTRY': createHttpEffect('api/now/table/x_esg_one_delivery_time_entry', {
        method: 'POST',
        dataParam: 'data',
        successActionType: 'WEEK_REFETCH',
        errorActionType: 'LOG_ERROR',
    })
} 