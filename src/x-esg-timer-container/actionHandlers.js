import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { toSnTime } from '../x-esg-timer-button/helpers';

import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from './payloads';
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
    'HANDLE_CONSULTANT_ID': ({action, dispatch, updateState, state}) => {
        const id = action.payload.result[0].sys_id;
        if(!id || action.payload.result.length !== 1){
            dispatch('LOG_ERROR', {msg: 'result.length !==1', data: action.payload});
        }else{
            updateState({consultantId: id});
            const {dateRange} = state;
            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(id, ...dateRange));
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
        }
    },
    'FETCH_CONSULTANT_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        successActionType: 'SET_CONSULTANT_TIMESTAMPS',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_CONSULTANT_TIMESTAMPS': ({action, updateState}) => {

        const timestamps = action.payload.result;
        const stampsByProject = new Map();
        
        // Massage for easy mapping
        // Subtracting the parsed ServiceNow zero duration time with 
        // Date.parse("1970-01-01 00:00:00") corrects for timezone issues, etc.
        for(let stamp of timestamps){
            const projectId = stamp['project.sys_id'];
            const active = stamp.active === 'true';

            const sharedValues = {
                active,
                sys_id: projectId,
                note: stamp.note,
                client: stamp['project.client.short_description'],
                short_description: stamp['project.short_description'],
            }
            if(stampsByProject.has(projectId)){
                stampsByProject.set(projectId, {
                    ...sharedValues,
                    timestamps: [stamp, ...stampsByProject.get(projectId).timestamps],
                    totalRoundedTime: stampsByProject.get(projectId).totalRoundedTime + 
                        (Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") 
                        || 0),
                });
            } else{
                stampsByProject.set(projectId, {
                    ...sharedValues,
                    timestamps: [stamp],
                    totalRoundedTime: Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") || 0,
                })
            }
        }
        updateState({projectMap: stampsByProject});
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
    'NEW_ENTRY': createHttpEffect('api/now/table/:tableName', {
        method: 'POST',
        pathParams: ['tableName'],
        dataParam: 'data',
        successActionType: 'LOG_RESULT',
        errorActionType: 'LOG_ERROR',
    }),
    'TEST_START': () => console.log('test start'),
    'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload),
    'LOG_ERROR': ({action}) => console.error(action.payload.msg, action.payload.data),
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
    'INSERT_SUCCESS': ({action, dispatch, state, updateState}) => {
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(state.consultantId, ...state.dateRange)
        );
        updateState({
            addProjectStatus: false,
            selectedProject: '',
            entryNotes: '',
        })
    },
    'UPDATE_TIMESTAMP': createHttpEffect(`api/now/table/:tableName/:sys_id`, {
        method: 'PUT',
        pathParams: ['tableName', 'sys_id'],
        successActionType: 'UPDATE_SUCCESS',
        errorActionType: 'LOG_RESULT',
        startActionType: 'LOG_RESULT',
        dataParam: 'data',
    }),
    'UPDATE_SUCCESS': ({dispatch, state}) => {
        console.log('UPDATE RESPONSE:');
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(state.consultantId)
            );
    },
} 