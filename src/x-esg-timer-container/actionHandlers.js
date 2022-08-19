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
        // dispatch('FETCH_PROJECTS', {
        //     tableName: 'x_esg_one_core_project',
        // });
    },
    'GET_CONSULTANT_ID': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query'],
        successActionType: 'HANDLE_CONSULTANT_ID'
    }),
    'HANDLE_CONSULTANT_ID': ({action, dispatch}) => {
        const id = action.payload.result[0].sys_id;
        if(!id || action.payload.result.length !== 1){
            dispatch('LOG_ERROR', {msg: 'result.length !==1', data: action.payload});
        }else{
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
        startActionType: 'TEST_START',
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
    'TEST_START': () => console.log('test start'),
    'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload),
    'LOG_ERROR': ({action}) => console.error(action.payload.msg, action.payload.data),
}