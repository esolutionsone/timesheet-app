timer-button
===============================================
A button to insert time logs on a target table

## Inputs

Schema
```
props = {
    user?: <Contractor>, // maybe not
    targetTable: e<Table>,
    project: <Project>,
    record?: <Timestamp>,
    recordedTime?: <Reduced TimeEntries>
}
```

## Implementation
(just spitballing)
- Client State Params: lookup list of user's projects => csp.projects
- Data resource: get all TimeEntries filtered by today, user, csp.projects (alt: all that, return only most recent for each project)
- Use Repeater to pass project data to **project cards**, then on to timer-buttons.

## Effects & logic
- [x] REST - insert/update time entry on click
    - [x] If button is inactive, insert new record w/ start timestamp
    - [x] If button is active, use update the record (tracked in state) with timestamp
- [ ] On Load, get sum of duration of completed time entries => display this + time since start (when entry is active)

## Concerns
- Dealing with the times is a big problem, when using the Javascript Date object, since SN doesn't use automatic detection of timezones. Better to rely completely on SN patterns and scripting, probably.

## Stuff we learned
- When setting dates in business rules, use .getDisplayValue() instead of .getValue(). On the server side, SN will adjust any times sent or received to a user who has a specified time zone, so when inputting dates, .getDisplayValue() will correspond to the correct UTC time.

## Issues

- [ ] Rounding messed up beyond the one minute mark - possibly just formatting

## QOL
- [ ] Add Loading/working states while waiting for REST
- [ ] Handle possible REST Errors

## Testing

### Tested Ourselves:
- [x] Clicking Inactive Timer Button Creates Record (active="true", start_time)
    - [x] Updates Button Appearance to Green
    - [x] Starts Counter
    - [x] Displays Rounded Times on Client Side
    - [x] Supplies new sys_id to button for update
- [x] Clicking Active Timer Button Updates Record (active="false", end_time)
    - [x] Updates Button Appearance to Red
    - [x] Stops Counter (on API response)
    - [x] Updates Record with end time

### Tested By Others

- [ ] Clicking Inactive Timer Button Creates Record (active="true", start_time)
    - [ ] Updates Button Appearance to Green
    - [ ] Starts Counter
    - [ ] Displays Rounded Times on Client Side
    - [ ] Supplies new sys_id to button for update
- [ ] Clicking Active Timer Button Updates Record (active="false", end_time)
    - [ ] Updates Button Appearance to Red
    - [ ] Stops Counter (on API response)
    - [ ] Updates Record with end time