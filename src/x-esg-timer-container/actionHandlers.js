import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({dispatch}) => {
        console.log('component bootstrapped');
        dispatch('GET_CONSULTANT_ID', {
            tableName: 'x_esg_one_core_consultant',
            sysparm_query: 'sys_user=javascript:gs.getUserID()'
        });
    },
    'GET_CONSULTANT_ID': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query'],
        successActionType: 'HANDLE_CONSULTANT_ID'
    }),
    'HANDLE_CONSULTANT_ID': ({action, dispatch, updateState}) => {
        const id = action.payload.result[0].sys_id;
        if(!id || action.payload.result.length !== 1){
            dispatch('LOG_ERROR', {msg: 'result.length !==1', data: action.payload});
        }else{
            updateState({consultantId: id});
            dispatch('FETCH_PROJECTS', {
                tableName: 'x_esg_one_core_project_role', 
                sysparm_query: `consultant_assigned=${id}`,
                sysparm_fields: `
                    project.sys_id,
                    project.short_description,
                    project.client.short_description
                `
            })
        }
    },
    'FETCH_PROJECTS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_PROJECTS',
        errorActionType: 'LOG_ERROR'
    }),
    'SET_PROJECTS': ({action, updateState}) => {
        // Store in Map to avoid duplicates
        // Also massage dot-walked addresses into a normal-looking object
        const projects = new Map();

        action.payload.result.forEach(role => {
            projects.set(role["project.sys_id"], {
            short_description: role["project.short_description"],
            client: role["project.client.short_description"],
            sys_id: role["project.sys_id"],
        })})
        updateState({projects: Array.from(projects.values())})
    },
    'NEW_ENTRY': createHttpEffect('api/now/table/:tableName', {
        method: 'POST',
        pathParams: ['tableName'],
        dataParam: 'data',
        successActionType: 'LOG_RESULT',
        errorActionType: 'LOG_RESULT',
    }),
    'TEST_START': () => console.log('test start'),
    'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload),
    'LOG_ERROR': ({action}) => console.error(action.payload.msg, action.payload.data),
    //Testing Timer stoppers,
    'INSERT_TIMESTAMP': ({action, dispatch}) => {
        console.log('caught insert action: ', action.payload)
        const payload = action.payload;
        payload.sysparm_query = `active=true^sys_id!=${payload.sys_id}`
        dispatch('STOP_SIBLINGS', action.payload);
    },
    'STOP_SIBLINGS': createHttpEffect('api/now/table/:timestampTable', {
        method: 'GET',
        pathParams: 'timestampTable',
        queryParams: ['sysparm_query'],
        successActionType: 'LOG_RESULT'
    })
} 