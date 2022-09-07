

export const Client = ({client}) => {
    console.log('Client', client)

    const projectList = client.projects;



    return (
        <div className="client-container">
            <span className="client-name">{client.short_description}</span>
            <div>
                {projectList.map(project => {
                    return (
                        <div className="project-item week-view-grid">
                            <div className="project-item-title">{project.short_description}</div>
                           
                            <input className="project-item-time" type="number" />
                            <input className="project-item-time" type="number" />
                            <input className="project-item-time" type="number" />
                            <input className="project-item-time" type="number" />
                            <input className="project-item-time" type="number" />
                            <input className="project-item-time" type="number" />
                            <input className="project-item-time" type="number" />
                        
                        </div>
                    );
                })}
            </div>
        </div>
    );
}