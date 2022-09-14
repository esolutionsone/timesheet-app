import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { WeeklyHeader } from "./components/WeeklyHeader";
import { Client } from './components/Client';
import { getWeekBounds } from "../helpers";

export const view = (state, { updateState, dispatch }) => {

    const {
        selectedDay,
        clientMap,
        projectMap,
        dailyEntries,
        project_stage_roles
    } = state

    const {consultantId} = state.properties;

    //  // Sort Projects by client
    // const allProjects = [...genericProjects, ...projects]
    // const sortedProjects = new Map();

    // allProjects.forEach(proj => {
    //     const client_id = proj.client.sys_id;
    //     if(sortedProjects.has(client_id)){
    //         sortedProjects.get(client_id).push(proj);
    //     }else{
    //         sortedProjects.set(client_id, [proj]);
    //     }
    // })

    // Create array of mappable dates
    const firstDate = getWeekBounds(selectedDay)[0];
    const dateArr = [];
    for(let i=0; i<7; i++){
        dateArr.push(new Date(firstDate));
        firstDate.setDate(firstDate.getDate() + 1);
    }

    console.log('week state:', state)

    return (
        <div className="week-container">
            <WeeklyHeader
                selectedDay={selectedDay}
                updateState={updateState}
                dispatch={dispatch}
            />
            <WeeklySubHeader
                selectedDay={selectedDay}
                projectMap={projectMap}
                dailyEntries={dailyEntries}
                dateArr={dateArr}
            />
            <div>
                {Array.from(clientMap.values()).map(client => {
                    return <Client 
                        key={client.sys_id}
                        client={client} 
                        dateArr={dateArr} 
                        dispatch={dispatch}
                        consultantId={consultantId} 
                        project_stage_roles={project_stage_roles}
                        />
                })}
            </div>
        </div>
    );
}