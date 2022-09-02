import WebFont from 'webfontloader';
import { getWeekBounds } from '../../helpers';
import { dateFormatter } from '../../constants'
import {format} from 'date-fns'


export const WeeklyHeader = ({selectedDay}) => {
   
    // Load Custom Fonts
    WebFont.load({
       google: {
           families: [
               'Montserrat:400,500,600,700', 
               'Material+Symbols+Outlined', 
               'Material+Symbols+Rounded'
           ]
       }
    })

    const startDay = format(getWeekBounds(selectedDay)[0], 'MMM dd')
    const endDay = format(getWeekBounds(selectedDay)[1], 'MMM dd, Y')


    return (
        <div className="weekly-header">
            <div className="weekly-left-right-buttons">
                <button className="chevron-left">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="chevron-right">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <div className="weekly-date-start">Week of</div>
            <div className="weekly-date-end">{startDay} to {endDay}</div>
        </div>
    );
}