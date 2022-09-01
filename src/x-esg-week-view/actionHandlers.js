import {actionTypes} from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';
import { getSnDayBounds, getSnWeekBounds, buildProjectMap } from '../helpers';
import { FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD } from '../payloads';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: ({state, properties, dispatch}) => {
        const {selectedDay} = state;
        const {consultantId} = properties;
        console.log(FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, getSnWeekBounds(selectedDay)))
        dispatch('FETCH_WEEKLY_TIMESTAMPS', 
            FETCH_CONSULTANT_TIMESTAMPS_PAYLOAD(consultantId, getSnWeekBounds(selectedDay))
        );
    },
    'FETCH_WEEKLY_TIMESTAMPS': createHttpEffect('api/now/table/:tableName', {
        method: 'GET',
        pathParams: ['tableName'],
        queryParams: ['sysparm_query', 'sysparm_fields'],
        startActionType: 'TEST_START',
        successActionType: 'SET_WEEKLY_TIMESTAMPS',
        errorActionType: 'LOG_ERROR',
    }),
    'SET_WEEKLY_TIMESTAMPS': ({action, updateState}) => {
        console.log('Setting timestamps: action:', action);
        updateState({projectMap: buildProjectMap(action.payload.result)});
    },
}