import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { WeeklyHeader } from "./components/WeeklyHeader";
import { Client } from './components/Client';
import { getWeekBounds } from "../helpers";
import { unflatten } from "../helpers";

export const view = (state, { updateState, dispatch }) => {

    const {
        selectedDay,
        project_stage_roles,
        addStages,
        entries,
        timestamps,
    } = state

    const {consultantId} = state.properties;
    
    // List unique client ids
    const clientIds = [...new Set(project_stage_roles.map(role => role.project_role.project.client.sys_id))];

    // Create array of mappable dates for the current week
    const firstDate = getWeekBounds(selectedDay)[0];
    const dateArr = [];
    for(let i=0; i<7; i++){
        dateArr.push(new Date(firstDate));
        firstDate.setDate(firstDate.getDate() + 1);
    }

    const handleSubmit = async () =>  {
		console.log('submit clicked', entries);
        // const delay = ms => new Promise(res => setTimeout(res, ms));

        entries.forEach((entry, i) => {
            dispatch('UPDATE_SUBMIT', {sys_id: entry.sys_id, data: { status: 'submitted'}})

            // if (i == (entries.length - 1)) {
            //     dispatch('WEEK_REFETCH')
            // }
        });
        // await delay(1000);
        // dispatch('TEST_BATCH')
        // dispatch('WEEK_REFETCH')
        
	}   

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
					<div className="total-time-display">Total <b>40.00</b></div>
					<button 
						className="submit-button"
						on-click={()=> handleSubmit()}>
							Submit Week
					</button>
				</div>
			</div>
        </div>
    );
}