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
    } = state

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
                    return <Client client={client} dateArr={dateArr} />
                })}
            </div>
        </div>
    );
}