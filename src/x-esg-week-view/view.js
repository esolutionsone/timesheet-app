import { WeeklyHeader } from "./components/WeeklyHeader";
import { WeeklySubHeader } from "./components/WeeklySubHeader";

export const view = (state) => {


	return (
        <div className="week-container">
            <WeeklyHeader />
            <WeeklySubHeader />
            WEEK VIEW
        </div>
    );
}