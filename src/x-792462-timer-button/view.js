import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import { difference, getUTCTime, stringifyDuration } from './helpers';

export const view = (state, {updateState, dispatch }) => {
	const {properties, currentTime} = state;
	const { active, start } = properties; 
    const style = { color: active == "true" ? 'green' : 'red' };

	// Update every second
	let interval = null;
    if ( active == "true" ) {
      interval = setInterval(() => {
        updateState({currentTime: new Date()});
		clearInterval(interval);
      }, 1000);
    } else if (active != "true") {
      clearInterval(interval);
    }

    const timerDuration = start ? difference(currentTime, getUTCTime(start)) 
        : {hours: 0, minutes: 0, seconds: 0};
    const timerDisplayValue = stringifyDuration(timerDuration);
	
	return (
		<Fragment>
			<button 
			style={style}
			on-click={() => {
				const {timestampTable } = properties;
				if(active !==  "true"){
					dispatch('INSERT_TIMESTAMP', {
						timestampTable,
						data: { active: true }
					})
				}else{
					// should we call this OPEN_ and CLOSE_TIMESTAMP?
					dispatch('UPDATE_TIMESTAMP', { timestampTable, 
						sys_id: properties.sysId,
						data: { active: false } 
					});
				}
			}
			}>{timerDisplayValue || 'Start'}</button>
		</Fragment>
	);
};