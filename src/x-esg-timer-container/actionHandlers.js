import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

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
    'HANDLE_CONSULTANT_ID': ({action, dispatch, updateState}) => {
        const id = action.payload.result[0].sys_id;
        if(!id || action.payload.result.length !== 1){
            dispatch('LOG_ERROR', {msg: 'result.length !==1', data: action.payload});
        }else{
            updateState({consultantId: id});
            dispatch('FETCH_CONSULTANT_TIMESTAMPS', {
                tableName: 'x_esg_one_delivery_timestamp',
                sysparm_query: `user=${id}^start_timeONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYstart_time`,
                sysparm_fields: 'project.client.short_description, project.sys_id, project.short_description, start_time, end_time, active, duration, rounded_duration, project.note'
            })
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
    'INSERT_TIMESTAMP': createHttpEffect(`api/now/table/:tableName`, {
        method: 'POST',
        pathParams: ['tableName'],
        dataParam: 'data',
        headers: {},
        startActionType: 'TEST_START',
        successActionType: 'INSERT_SUCCESS',
        errorActionType: 'LOG_ERROR',
    }),
    'INSERT_SUCCESS': ({dispatch, state}) => {
        dispatch('FETCH_CONSULTANT_TIMESTAMPS', {
            tableName: 'x_esg_one_delivery_timestamp',
            sysparm_query: `user=${state.consultantId}^start_timeONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORDERBYstart_time`,
            sysparm_fields: 'project.client.short_description, project.sys_id, project.short_description, start_time, end_time, active, duration, rounded_duration, project.note'
        })
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
        console.log("timestamps =", timestamps);
        const stampsByProject = new Map();
        
        // Massage for easy mapping
        // Subtracting the parsed ServiceNow zero duration time with 
        // Date.parse("1970-01-01 00:00:00") corrects for timezone issues, etc.
        for(let stamp of timestamps){
            const projectId = stamp['project.sys_id'];
            const active = stamp.active === 'true';
            console.log(" stamp =", stamp);
            if(stampsByProject.has(projectId)){
                stampsByProject.set(projectId, {
                    active,
                    note: 'Example Notes Go Here',
                    sys_id: projectId,
                    client: stamp['project.client.short_description'],
                    short_description: stamp['project.short_description'],
                    timestamps: [stamp, ...stampsByProject.get(projectId).timestamps],
                    totalRoundedTime: stampsByProject.get(projectId).totalRoundedTime + 
                        (Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") 
                        || 0),
                });
            } else{
                stampsByProject.set(projectId, {
                    active,
                    note: 'Example Notes Go Here',
                    sys_id: projectId,
                    client: stamp['project.client.short_description'],
                    short_description: stamp['project.short_description'],
                    timestamps: [stamp],
                    totalRoundedTime: Date.parse(stamp.rounded_duration) - Date.parse("1970-01-01 00:00:00") || 0,
                })
            }
        }
        console.log("stampsByProject =", stampsByProject);
        updateState({projectMap: stampsByProject});
    }
} 