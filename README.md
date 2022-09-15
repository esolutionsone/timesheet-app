# Timesheet App

### Description 
*A UI Builder component and subcomponents for tracking time related to esolutionsONE projects*

## Dev Screenshots

<img src="images/Screen Shot 2022-09-01.png" />

## Stuff we learned
- When setting dates in business rules, use .getDisplayValue() instead of .getValue(). On the server side, SN will adjust any times sent or received to a user who has a specified time zone, so when inputting dates, .getDisplayValue() will correspond to the correct UTC time.

- Deleting an existing custom component:
    - Need to nevigate to sys_app.list and locate the scope that the component currently exists in.
    - Manually delete records that are associated to component (It seems as though the amount of records varies depending on how many things are in now-ui.json)
    - Tip to find all of the records, redeploy component with --force and head to sys_app.list, open scope, and sort by recently updated records. All records associated with component should
    be at the top. 

## Errors
- Cannot create property 'elm' on boolean 'false' at createElm
    - While we can use short circuits in jsx, we can't use them to wipe out an entire element. Instead, use a ternary (I guess so there's something to replace it with on the VDOM, even if it's just a string?)

## Architectural Q's

- Will the project_role and project_stage 'active' statuses be updated and in sync? Do we need to check project.state as well?
## Data Structure
    fetch on project_stage_role where consultant is you, project_role = active, project_stage = active

    2x fetch on timestamp/time entry where consultant is you, 
    EITHER: start_time within bounds OR date within bounds and project_role.active = true, project_stage.active = true

    Query for project_stage_role table and gets the default projects, stages, clients: 
        project_stage_roles: [{
            sys_id,
            used_hours,
            project_role.role_description, (project_role.short_description -> not role_description??)
            project_role.project.short_description,
            project_role.project.sys_id,
            project_role.project.client.sys_id,
            project_role.project.client.short_description,
            project_stage.sys_id,
            project_stage.name,
            }
        ]

    Query for time_entry table:
        entries: [{
            sys_id,
            date,
            time_adjustment,
            adjustment_direction,
            note,
            project_stage_role.sys_id,
            project_stage_role.project_stage.sys_id,
            project_stage_role.project_stage.project.sys_id,
            project_stage_role.project_stage.project.client.sys_id,
            }
        ]

    Query for timestamp table:
        stamps: [{
            sys_id,
            start_time,
            end_time,
            duration,
            rounded_duration,
            note,
            project_stage_role.sys_id,
            project_stage_role.project_stage.sys_id,
            project_stage_role.project_stage.project.sys_id,
            project_stage_role.project_stage.project.client.sys_id,
            }
        ]

    App state: 
        {
            consultantId,
            addProjectState,
            editMode,
            loading,
            location,
        }
    NOTE: Generic projects must have a project_role and Project_stage_role for each consultant

    Week State: 
        {
            selectedDay,
            stamps,
            entries,
            project_stage_roles,
        }
        
    NOTE: Maybe a state to indicate that all APIs have returned (week/day)

    Day state:
        {
            selectedDay,
            timerNotes,
            selectedProject,
            selectedRole,
            editableTimestamp,
            stamps,
        }


    
    
