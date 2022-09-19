export const AddProject = ({
                                addProjectStatus, 
                                projects, 
                                selectedProject, 
                                entryNotes, 
                                genericProjects, 
                                projectMap,
                                updateState,
                                consultantId,
                                timeEntryTable,
                                timestampTable,
                                dispatch,
                                selectedDay }) => {

     // Combine Generic projects and user-specific projects,
    // Then filter out projects that are already being tracked today
    const allProjects = [...genericProjects, ...projects].filter(proj => {
        return !projectMap.has(proj.sys_id)
    });

    const handleSave = (e) => {
        e.preventDefault();
        if (selectedProject == '') {
            alert('Please select a project before continuing.')
        } else {
            // dispatch('NEW_ENTRY', {
            //     data: {
            //         project: selectedProject,
            //         consultant: consultantId,
            //         note: entryNotes,
            //     },
            //     tableName: timeEntryTable,
            // });
            dispatch('INSERT_TIMESTAMP', {
                data: { 
                    active: true, 
                    project: selectedProject,
                    note: entryNotes,
                },
                tableName: timestampTable,
            });
        }
    }

    return (
        <div>
            {!addProjectStatus ? 
                <div></div> 
                : 
                <div>
                    <span className="new-project-header">Project / Task</span>
                    <form className="new-project-body" on-submit={handleSave}>
                        <select
                            className="new-project-dropdown"
                            on-change={(e)=>updateState({selectedProject: e.target.value})}>
                                <option disabled selected>Choose a Project</option>
                                {allProjects.map(proj => <option value={proj.sys_id}>
                                    {proj.short_description}
                                </option>)}
                        </select>
                        <div className="new-project-text-container">
                            <textarea 
                                className="new-project-text"
                                on-keyup={(e)=> updateState({entryNotes: e.target.value})}
                                maxlength='512'
                                placeholder="Enter your notes here..."
                            ></textarea>

                            <button className="new-project-save-button">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
}