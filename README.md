# Timesheet App

### Description 
*A UI Builder component and subcomponents for tracking time related to esolutionsONE projects*

## Dev Screenshots

<img src="images/Screen Shot 2022-09-01.png" />

## Stuff we learned
- When setting dates in business rules, use .getDisplayValue() instead of .getValue(). On the server side, SN will adjust any times sent or received to a user who has a specified time zone, so when inputting dates, .getDisplayValue() will correspond to the correct UTC time.

## Errors
- Cannot create property 'elm' on boolean 'false' at createElm
    - While we can use short circuits in jsx, we can't use them to wipe out an entire element. Instead, use a ternary (I guess so there's something to replace it with on the VDOM, even if it's just a string?)
