import { WeeklyHeader } from "./components/WeeklyHeader";
import { WeeklySubHeader } from "./components/WeeklySubHeader";

export const view = (state, {updateState}) => {

    const { selectedDay, projectMap, dailyEntries } = state

    console.log("STATE", state);
    
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
            WEEK VIEW
        </div>
    );
}