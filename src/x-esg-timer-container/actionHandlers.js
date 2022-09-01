import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { buildProjectMap, getSnDayBounds} from '../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../payloads';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({state, properties, dispatch}) => {
        console.log('state', state)
        const {selectedDay} = state;
        const {consultantId} = properties;

        if(consultantId.length < 1){
            dispatch('LOG_ERROR', {msg: 'No consultant id provided', data: state});
        }else{
            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(selectedDay)));
        }
    },
    'TIMER_CONTAINER#UPDATE_STATE': ({action, updateState}) => {updateState(action.payload)},
    'NEW_ENTRY': createHttpEffect('api/now/table/:tableName', {
        method: 'POST',
        pathParams: ['tableName'],
        dataParam: 'data',
        successActionType: 'LOG_RESULT',
        errorActionType: 'LOG_ERROR',
    }),
    //Testing Timer stoppers,
    'DELETE_PROJECT_TIMESTAMPS': createHttpEffect(`api/now/table/x_esg_one_delivery_timestamp/:id`, {
        method: 'DELETE',
        pathParams: [ 'id'],
        startActionType: 'TEST_START',
        successActionType: 'LOG_RESULT',
        errorActionType: 'LOG_ERROR'
    }),
    'INSERT_TIMESTAMP': createHttpEffect(`api/now/table/:tableName`, {
        method: 'POST',
        pathParams: ['tableName'],
        dataParam: 'data',
        headers: {},
        successActionType: 'INSERT_SUCCESS',
        errorActionType: 'LOG_ERROR',
    }),
    'INSERT_SUCCESS': ({dispatch, state, updateState}) => {
        const {selectedDay} = state;
        const {consultantId} = state.properties;
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(
                consultantId, 
                ...getSnDayBounds(selectedDay)
                )
        );
        updateState({
            selectedProject: '',
            entryNotes: '',
        })
    },
    'UPDATE_TIMESTAMP': createHttpEffect(`api/now/table/:tableName/:sys_id`, {
        method: 'PUT',
        pathParams: ['tableName', 'sys_id'],
        successActionType: 'UPDATE_SUCCESS',
        errorActionType: 'LOG_ERROR',
        startActionType: 'LOG_RESULT',
        dataParam: 'data',
    }),
    'UPDATE_SUCCESS': ({action, dispatch, state, properties}) => {
        const {consultantId} = properties;
        const {selectedDay} = state;
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(
                consultantId, 
                ...getSnDayBounds(selectedDay)
                )
            );
    },
    'FETCH_CONSULTANT_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        startActionType: 'TEST_START',
        successActionType: 'SET_CONSULTANT_TIMESTAMPS',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_CONSULTANT_TIMESTAMPS': ({action, updateState}) => {
        updateState({projectMap: buildProjectMap(action.payload.result)});
    },
} 