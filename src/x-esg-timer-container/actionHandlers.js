import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { getSnDayBounds} from '../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../payloads';

const {COMPONENT_BOOTSTRAPPED, COMPONENT_RENDERED, COMPONENT_RENDER_REQUESTED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({state, properties, dispatch}) => {
        console.log('state', state)
        const {selectedDay} = state;
        const {consultantId} = properties;

        if(consultantId.length < 1){
            dispatch('LOG_ERROR', {msg: 'No consultant id provided', data: state});
        }else{
            dispatch('FETCH_CONSULTANT_TIMESTAMPS', FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, ...getSnDayBounds(selectedDay)));
            dispatch('FETCH_PROJECTS', {
                tableName: 'x_esg_one_core_project_role', 
                sysparm_query: `consultant_assigned=${consultantId}`,
                sysparm_fields: `
                    project.sys_id,
                    project.short_description,
                    project.client.short_description,
                    project.client.sys_id
                `
            })
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
        console.log('Setting timestamps: action:', action);
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
} 