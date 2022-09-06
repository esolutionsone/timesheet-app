import { WeeklyHeader } from "./components/WeeklyHeader";
import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { Client } from './components/Client'

export const view = (state, {updateState}) => {

    const { 
        selectedDay, 
        clientMap, 
        projectMap, 
        dailyEntries,
    } = state
    const clientList = Array.from(clientMap.values());

    const {genericProjects, projects} = state.properties;

    console.log("WEEK STATE", state);
    console.log('generic projects', genericProjects)

	return (
        <div className="week-container">
            <WeeklyHeader 
                selectedDay={selectedDay}
                updateState={updateState}
            />
            <WeeklySubHeader
                selectedDay={selectedDay}
                projectMap={projectMap}
                dailyEntries={dailyEntries}
            />
            <div className="add-project-container">
                {clientList.map(client => {
                    const allProjects = [...genericProjects, ...projects];
                    console.log("allProjects", allProjects);
                    return(
                        <div className="add-project-items">
                            <span className="add-project-client">{client.short_description}</span>
                            <div className="add-project-selections">
                                {allProjects.map(project => {
                                    return (
                                        <div>
                                            <input type="checkbox" id={project.short_description} name={project.short_description}/>
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
                {clientList.map(client => <Client client={client}/> )}
            </div>

        </div>
    );
}