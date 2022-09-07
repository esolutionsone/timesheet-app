import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { WeeklyHeader } from "./components/WeeklyHeader";
import { Client } from './components/Client'

export const view = (state, { updateState, dispatch }) => {

    const {
        selectedDay,
        clientMap,
        projectMap,
        dailyEntries,
    } = state
    const clientList = Array.from(clientMap.values());

    const { genericProjects, projects } = state.properties;

    // Get the ids of current active Projects, then filter
    // consultant projects to return difference.
    const activeProjectIds = Array.from(projectMap.keys());
    const allProjects = [...genericProjects, ...projects]
        .filter(proj => !activeProjectIds.includes(proj.sys_id));
    const sortedProjects = new Map();

    // Then sort the lists into a map based on client.
    allProjects.forEach(proj => {
        const client = proj.client.short_description;
        if(sortedProjects.has(client)){
            sortedProjects.get(client).push(proj);
        }else{
            sortedProjects.set(client, [proj]);
        }
    })

    console.log("WEEK STATE", state);
    console.log('selectedDay = ', selectedDay);

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
            />
            <div className="add-project-container">
                {Array.from(sortedProjects.entries()).map(([client, projects]) => {
                    // Get the ids of current active Projects, then filter
                    // consultant projects to return difference.
                    return (
                        <div className="add-project-items">
                            <span className="add-project-client">{client}</span>
                            <div className="add-project-selections">
                                {projects.map(project => {
                                    return (
                                        <div>
                                            <input type="checkbox" id={project.short_description} name={project.short_description} />
                                            <label className="" htmlFor={project.short_description}>{project.short_description}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div>
                {clientList.map(client => <Client client={client} />)}
            </div>

        </div>
    );
}