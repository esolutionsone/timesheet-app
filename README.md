timer-button
===============================================
A button to insert time logs on a target table

## Inputs

Schema
```
props = {
    user: <Contractor>,
    targetTable: e<Table>,
    project: <Project>,
    record?: <TimeEntry>,
    recordedTime?: <Reduced TimeEntries>
}
```

## Implementation
(just spitballing)
- Client State Params: lookup list of user's projects => csp.projects
- Data resource: get all TimeEntries filtered by today, user, csp.projects (alt: all that, return only most recent for each project)
- If most re

## Effects & logic
- [ ] REST - insert/update time entry on click
    - [ ] If button is inactive, insert new record w/ start timestamp
    - [ ] If button is active, use update the record (tracked in state) with timestamp
- [ ] On Load, get sum of duration of completed time entries => display this + time since start (when entry is active)

