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
- Use Repeater to pass project data to **project cards**, then on to timer-buttons.

## Effects & logic
- [ ] REST - insert/update time entry on click
    - [ ] If button is inactive, insert new record w/ start timestamp
    - [ ] If button is active, use update the record (tracked in state) with timestamp
- [ ] On Load, get sum of duration of completed time entries => display this + time since start (when entry is active)

## Concerns
- Dealing with the times is a big problem, when using the Javascript Date object, since SN doesn't use automatic detection of timezones. Better to rely completely on SN patterns and scripting, probably.

## Issues

WILL DO
first click
- [x] Insert Record
- [ ] Timer Starts (probably weird time)
- [x] Red to green
- [x] Active = true

second click
- [ ] Active = false
- [ ] Probably timer keeps going
- [ ] end_time updated by business rule
- [x] Green stays green (not intended)
- [x] We get console.log with result from put request

============

WILL DO
first click
- [x] Insert Record
- [ ] Timer Starts (probably weird time)
- [x] Red to green
- [x] Active = true

second click
- [ ] Active = false
- [ ] Probably timer keeps going
- [ ] end_time updated by business rule
- [x] Green stays green (not intended)
- [x] We get console.log with result from put request