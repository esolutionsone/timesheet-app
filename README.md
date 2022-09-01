# Timesheet App

## Description 
*A UI Builder component and subcomponents for tracking time related to esolutionsONE projects*

## Dev Screenshots

<img src="images/Screen Shot 2022-09-01.png" />

## Stuff we learned
- When setting dates in business rules, use .getDisplayValue() instead of .getValue(). On the server side, SN will adjust any times sent or received to a user who has a specified time zone, so when inputting dates, .getDisplayValue() will correspond to the correct UTC time.

## Errors
- Cannot create property 'elm' on boolean 'false' at createElm
    - While we can use short circuits in jsx, we can't use them to wipe out an entire element. Instead, use a ternary (I guess so there's something to replace it with on the VDOM, even if it's just a string?)

## Issues

- [ ] Starting and stopping timers needs additional work and planning
- [ ] Fonts Are loaded multiple times (not necessarily a huge issue for us, since they'll be cached)
    - They work fine as long as they're loaded anywhere on the page - but must be loaded at least once.

## QOL
- [ ] Add Loading/working states while waiting for REST
- [ ] Pause Current Time when waiting for button API response (or recording loading state) 
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

### Feedback

- Loading
    - [ ] Timestamp insert ('starting timer')
    - [ ] Timestamp update ('saving time')
- Errors / validation
    - [ ] when Time is after 
    - [ ] Missing ConsultantId