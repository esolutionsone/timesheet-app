import { actionTypes } from '@servicenow/ui-core';
import { createHttpEffect } from '@servicenow/ui-effect-http';

const {COMPONENT_BOOTSTRAPPED} = actionTypes;

export default {
    [COMPONENT_BOOTSTRAPPED]: () => {

    },
    'TEST_START': () => console.log('test start'),
    'LOG_RESULT': ({action}) => console.log('LOGGED RESULT', action.payload)
}