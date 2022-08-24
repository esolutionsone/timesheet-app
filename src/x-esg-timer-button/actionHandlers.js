import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({state, dispatch, properties}) => {
        const {sysId, timestampTable} = properties;
        if(sysId){
            dispatch('FETCH_TIMER_STATUS', {sys_id: sysId, timestampTable});
        }
    }, // replace with REST
    'UPDATE_TIMESTAMP': createHttpEffect(`api/now/table/:tableName/:sys_id`, {
        method: 'PUT',
        pathParams: ['tableName', 'sys_id'],
        successActionType: 'UPDATE_SUCCESS',
        errorActionType: 'LOG_RESULT',
        startActionType: 'LOG_RESULT',
        dataParam: 'data',
    }),
    'FETCH_TIMER_STATUS': createHttpEffect(`api/now/table/:timestampTable/:sys_id`, {
        method: 'GET',
        pathParams: ['timestampTable', 'sys_id'],
        successActionType: 'SET_TIMER_STATUS',
        startActionType: 'LOG_RESULT',
        errorActionType: 'LOG_RESULT',
    }),
    'SET_TIMER_STATUS': ({action, updateProperties}) => {
        updateProperties({
            start: action.payload.result.start_time,
            active: action.payload.result.active
        });

    },
    'TIMER_BUTTON#CLICKED': ({action}) => console.log(action.payload),
    // 'INSERT_TIMESTAMP': createHttpEffect(`api/now/table/:tableName`, {
    //     method: 'POST',
    //     pathParams: ['tableName'],
    //     dataParam: 'data',
    //     headers: {},
    //     startActionType: 'INSERT_START',
    //     successActionType: 'INSERT_SUCCESS',
    //     errorActionType: 'INSERT_ERROR',
    // }),
    'INSERT_START': ({host}) => console.log('REST called', host),
    'INSERT_SUCCESS': ({action, updateProperties, updateState}) => {
        console.log('INSERT RESULT:', action.payload);
        updateProperties({
            sysId: action.payload.result.sys_id,
            active: action.payload.result.active,
            start: action.payload.result.start_time,
        });
    },
    'INSERT_ERROR': ({action}) => console.log(action.payload),
    'UPDATE_SUCCESS': ({action, updateProperties}) => {
        const {active} = action.payload.result;
        console.log('update response: ', action.payload.result);
        updateProperties({active});
    },
    'TEST_GET': createHttpEffect(`api/now/table/:table_name`, {
            pathParams: ['table_name'],
            method: 'GET',
            queryParams: ['sysparm_limit'],
            startActionType: 'TEST_START',
            successActionType: 'INSERT_SUCCESS',

        }),
    'TEST_START': () => console.log('test start'),
    'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload)
}