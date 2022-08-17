import { Fragment } from '@servicenow/ui-renderer-snabbdom';
import { difference, getUTCTime } from './helpers';

export const view = (state, {updateState, dispatch }) => {
	const {properties, seconds, currentTime} = state;
	const { active, start } = properties;

    const timerDisplayValue = difference(currentTime, getUTCTime(start));
	const style = { color: active == "true" ? 'green' : 'red' }

	// Update every second
	let interval = null;
    if ( active == "true" ) {
      interval = setInterval(() => {
        updateState({currentTime: new Date()});
		clearInterval(interval);
      }, 1000);
    } else if (active != "true" && seconds !== 0) {
      clearInterval(interval);
    }

    

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
					console.log('timestamptable', timestampTable);
					dispatch('UPDATE_TIMESTAMP', { timestampTable, 
						sys_id: properties.sysId,
						data: { active: false } 
					});
				}
			}
			}>{timerDisplayValue}</button>
		</Fragment>
	);
};