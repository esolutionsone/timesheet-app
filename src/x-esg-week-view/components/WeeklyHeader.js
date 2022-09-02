import WebFont from 'webfontloader';


export const WeeklyHeader = () => {
   
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
            <div className="weekly-date-end">Aug 29 to Sep 04, 2022</div>
        </div>
    );
}