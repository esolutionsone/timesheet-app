import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { WeeklyHeader } from "./components/WeeklyHeader";
import { Client } from './components/Client';
import { getWeekBounds, getUTCTime, msToString, unflatten } from "../helpers";

export const view = (state, { updateState, dispatch }) => {

    const {
        selectedDay,
        project_stage_roles,
        addStages,
        entries,
        timestamps,
    } = state

    const {consultantId} = state.properties;
    // Check if any entries are submitted;
    const inDraftState = entries.filter(entry => entry.status != 'draft')
        .length < 1;

    console.log(inDraftState);
    
    // List unique client ids
    const clientIds = [...new Set(project_stage_roles.map(role => role.project_role.project.client.sys_id))];

    // Create array of mappable dates for the current week
    const firstDate = getWeekBounds(selectedDay)[0];
    const dateArr = [];
    for(let i=0; i<7; i++){
        dateArr.push(new Date(firstDate));
        firstDate.setDate(firstDate.getDate() + 1);
    }

    const handleStatus = () =>  {
        
        let entryStatus = '';
        let submitMessage = '';

        if(inDraftState){
            entryStatus = 'submitted';
            submitMessage = 'submit';
        }else{
            entryStatus = 'draft';
            submitMessage = 'recall and edit'
        }

        // switch (entries[0].status) {
        //     case 'draft':
        //         entryStatus = 'submitted';
        //         submitMessage = 'submit';
        //         break;
        //     case 'submitted':
        //         entryStatus = 'draft';
        //         submitMessage = 'recall and edit';
        //         break;
        //     default:
        //         break;
        // }

        if (confirm(`Click OK to ${submitMessage} timesheet`) == true) {

            entries.forEach(entry => {
                dispatch('UPDATE_SUBMIT', {sys_id: entry.sys_id, data: { status: entryStatus}})
            });
        }
	}   

    let myTime = 0;
    
    entries.forEach(entry => {
        if ( entry.time_adjustment != '') {
            let time = getUTCTime(entry.time_adjustment);
            myTime += time.getTime();
        } else {
            let time = getUTCTime("1970-01-01 00:00:00");
            myTime += time.getTime();
        }
    });

    timestamps.forEach(stamp => {
        if ( stamp.rounded_duration != '') {
            let time = getUTCTime(stamp.rounded_duration);
            myTime += time.getTime();
        } else {
            let time = getUTCTime("1970-01-01 00:00:00");
            myTime += time.getTime();
        }
    });

    const today = new Date();

    return (
        <div>
            <div className="week-container">
                <WeeklyHeader
                    selectedDay={selectedDay}
                    updateState={updateState}
                    dispatch={dispatch}
                />
                <WeeklySubHeader
                    selectedDay={selectedDay}
                    entries={entries}
                    timestamps={timestamps}
                    dateArr={dateArr}
                />
                <div>
                    {clientIds.map(sys_id => {
                        // Filter psrs by client
                        let psrs = project_stage_roles.filter(psr => {
                            return sys_id === psr.project_role.project.client.sys_id
                        })
                        
                        return (
                            <Client
                                psrs={psrs}
                                updateState={updateState}
                                addStages={addStages}
                                name={psrs[0].project_role.project.client.short_description}
                                entries={state.entries}
                                timestamps={state.timestamps}
                                dateArr={dateArr}
                                dispatch={dispatch}
                                consultantId={consultantId}
                                selectedDay={selectedDay}
                                inDraftState={inDraftState}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="footer-container">
				<div className="note-container">Please note that all timesheets must be <b>submitted and approved by Sunday at 11 pm each week </b>
					to guarantee inclusion in weekly invoicing/utilization batch jobs. 
					Failure to do so may result in delays in payment/utilization.</div>
				<div className="submit-time-container">
					<div className="total-time-display">Total <b>{msToString(myTime)}</b></div>
                    {selectedDay.getDate() != today.getDate() ?
                        ''
                        :
                        (!inDraftState && entries[0].status == 'invoiced') ?
                        <button 
                            className="submit-button disabled-button"
                            on-click={()=> handleStatus()}
                            disabled>
                                {entries[0].status == 'draft' ? 'Submit Week' : 'Recall Timesheet'}
					    </button> 
                        : 
                        <button 
                            className="submit-button"
                            on-click={()=> handleStatus()}
                            >
                                {inDraftState ? 'Submit Week' : 'Recall Timesheet'}
					    </button>
                    }
				</div>
			</div>
        </div>
    );
}