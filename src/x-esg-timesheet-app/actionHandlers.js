import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

import { getSnDayBounds} from '../helpers';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;


export default {
    [COMPONENT_BOOTSTRAPPED]: ({dispatch}) => {
        console.log('component bootstrapped');
        dispatch('FETCH_GENERIC_PROJECTS', {
            sysparm_query: 'client=705bf1231b6c9950c9df43b8b04bcbec',
            sysparm_fields: 'short_description,sys_id,client.short_description,client.sys_id'
        })
        dispatch('GET_CONSULTANT_ID', {
            tableName: 'x_esg_one_core_consultant',
            sysparm_query: 'sys_user=javascript:gs.getUserID()'
        });
    },
    'GET_CONSULTANT_ID': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query'],
        errorActionType: 'LOG_ERROR',
        successActionType: 'HANDLE_CONSULTANT_ID'
    }),
    'HANDLE_CONSULTANT_ID': ({action, updateState, dispatch}) => {
        const id = action.payload.result[0].sys_id;
        updateState({consultantId: id})
        dispatch('FETCH_PROJECTS', {
            tableName: 'x_esg_one_core_project_role', 
            sysparm_query: `consultant_assigned=${id}`,
            sysparm_fields: `
                project.sys_id,
                project.short_description,
                project.client.short_description,
                project.client.sys_id
            `
        })
    },
    'FETCH_GENERIC_PROJECTS': createHttpEffect(
        'api/now/table/x_esg_one_core_project',
        {
            method: 'GET',
            queryParams: ['sysparm_query', 'sysparm_fields'],
            successActionType: 'SET_GENERIC_PROJECTS',
            errorActionType: 'LOG_ERROR'
    }),
    'SET_GENERIC_PROJECTS': ({action, updateState}) => {
        const response = action.payload.result;
        for(let proj of response){
            proj["client"] = {
                short_description: proj["client.short_description"],
                sys_id: proj["client.sys_id"],
            }
            delete proj["client.short_description"];
            delete proj["client.sys_id"];
        }
        updateState({genericProjects: response})
    },
    'FETCH_PROJECTS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_PROJECTS',
        errorActionType: 'LOG_ERROR'
    }),
    'SET_PROJECTS': ({action, updateState, state}) => {
        // Store in Map to avoid duplicates
        // Also massage dot-walked addresses into a normal-looking object
        const projects = new Map();

        action.payload.result.forEach(role => {
            projects.set(role["project.sys_id"], {
            short_description: role["project.short_description"],
            client: {
                short_description: role["project.client.short_description"],
                sys_id: role["project.client.sys_id"],
            },
            sys_id: role["project.sys_id"],
        })})
        updateState({
            projects: Array.from(projects.values())
        })
    },
    'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload),
    'LOG_ERROR': ({action}) => console.error('ERROR', action.payload.msg, action.payload.data),
    'TEST_START': () => console.log('test start'),
    'INSERT_SUCCESS': ({updateState}) => updateState({addProjectStatus: false}) 
  
}