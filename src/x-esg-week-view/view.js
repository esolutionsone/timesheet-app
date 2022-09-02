import { WeeklyHeader } from "./components/WeeklyHeader";
import { WeeklySubHeader } from "./components/WeeklySubHeader";

export const view = (state) => {

    const { selectedDay, projectMap, dailyEntries } = state

    console.log("STATE", state);

    
    

	return (
        <div className="week-container">
            <WeeklyHeader 
                selectedDay={selectedDay}
            />
            <WeeklySubHeader
                selectedDay={selectedDay}
                projectMap={projectMap}
                dailyEntries={dailyEntries}
            />
            WEEK VIEW
        </div>
    );
}