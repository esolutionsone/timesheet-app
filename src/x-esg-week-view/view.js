import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { WeeklyHeader } from "./components/WeeklyHeader";
import { Client } from './components/Client';
import { getWeekBounds } from "../helpers";
import { unflatten } from "../helpers";

export const view = (state, { updateState, dispatch }) => {

    const {
        selectedDay,
        clientMap,
        projectMap,
        dailyEntries,
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

    return (
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
    );
}