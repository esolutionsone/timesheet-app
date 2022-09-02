import { WeeklyHeader } from "./components/WeeklyHeader";
import { WeeklySubHeader } from "./components/WeeklySubHeader";

export const view = (state) => {

    const { selectedDay } = state

    console.log("STATE", state);
    

	return (
        <div className="week-container">
            <WeeklyHeader 
                selectedDay={selectedDay}
            />
            <WeeklySubHeader />
            WEEK VIEW
        </div>
    );
}