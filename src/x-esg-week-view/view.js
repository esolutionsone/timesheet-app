import { WeeklyHeader } from "./components/WeeklyHeader";
import { WeeklySubHeader } from "./components/WeeklySubHeader";
import { Client } from './components/Client'

export const view = (state) => {

    const { selectedDay, clientMap } = state
    const clientList = Array.from(clientMap.values())

    console.log("STATE", state);
    console.log("Client Map", clientMap);
    console.log(Array.from(clientMap.values()));
    

	return (
        <div className="week-container">
            <WeeklyHeader 
                selectedDay={selectedDay}
            />
            <WeeklySubHeader />
            <div>
                {clientList.map(client => <Client client={client}/> )}
            </div>
            
        </div>
    );
}