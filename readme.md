# Timeline data
Wrap data in a timeline, where the value of the data changes over a range of time.

## Features
- Supports open-ended start/end dates
- Customisable granularity (defaults to 'day')
- Does not mutate entries
- Computed timeline is cached so single entry lookups are fast
- Typescript definitions provided
- Full code coverage

## How to use
You can supply any value to an entry, overlapping entries are automatically resolved. An example usage:
```typescript
//optional configuration (defaults shown)
const timeline = new Timeline({
  dateFormat: 'YYYY-MM-DD',
  granularity: 'day'
}); 

timeline.addEntry({
  startDate: '2017-05-04', 
  endDate: '2019-06-09', 
  value: 'Test'
});

timeline.addEntry({
  startDate: '2018-04-23', 
  endDate: '2018-09-09', 
  value: 'New value'
});

timeline.getEntryOn('2018-03-04').value; //'Test'
timeline.getEntryOn('2018-05-12').value; //'New value'
timeline.getEntryOn('2019-03-04').value; //'Test'

timeline.getDateEntries(); 
/*
Returns:
[
  { startDate: '2017-05-04', endDate: '2018-04-22', value: 'Test' }, 
  { startDate: '2018-04-23', endDate: '2018-09-09', value: 'New value' }, 
  { startDate: '2018-09-10', endDate: '2019-06-09', value: 'Test' }
]
*/
```

### Hints
- Start and end dates are inclusive
- Designed to treat the entries as immutable - add new entries to replace the old ones

## Using in node
Install via npm with `npm install apl-timeline`, then import via ES6 Modules:
```typescript
import { Timeline } from 'apl-timeline';
```

## Using in the browser
This library has a dependency on `moment.js`. You can include it yourself and use the small minified file inside lib or at unpkg (4KB):
```html
<script src="https://unpkg.com/moment@2.22.2/min/moment-with-locales.min.js"></script>
<script src="http://unpkg.com/apl-timeline/lib/apl-timeline.min.js"></script>
```

If you are not already using moment, you can use the single umd bundle that includes all dependencies in the same package (260KB):
```html
<script src="http://unpkg.com/apl-timeline/lib/apl-timeline.umd.js"></script>
```

## API

### Interfaces

#### TimelineEntry
Used to represent a value that changes over a start and end date/time

| Name | Type | Optional | Description |
|---|---|---|---|
| startDate | string | yes | The start date to use, should match format of dateFormat (inclusive) (optional)  |
| endDate | string | yes | The end date to use, should match format of dateFormat (inclusive) (optional) |
| value | any | yes | The data that should be used between the two dates (optional) |

#### TimelineConfig
Used to customise the functionality of the timeline, all have defaults and can be optionally overwritten:

| Name | Type | Default | Description |
|---|---|---|---|
| dateFormat | string | 'YYYY-MM-DD' | Used for parsing and format new dates created for entries in the timeline |
| granularity | string | 'day' | How specific the dates are for the value in the entry |

### Classes

#### Timeline
The main class used to create and manage creating entries over a timeline.

| Method | Description | Paramaters | Return Type |
|---|---|---|---|
| *constructor* | Creates a new timeline instance | config: TimelineConfig (optional) | new Timeline |
| addEntry | Add a new entry object to the timeline | entry: TimelineEntry | none |
| getEntryOn | Gets a single entry for a specific date | date: string | entry:  TimelineEntry |
| getDateEntries | Gets a flat list of all of the entries ordered by date (earliest first) | none | arr: Array\<TimelineEntry\> |

## How to

### Add a default value for all entries on a timeline
Simply create a timeline and add an entry with the default value with no startDate or endDate.

### Identify timeline entries with an id
The interface is designed to be as simple as possible with only start and end dates required, you can add an object to the 'value' field and assign an id to the object instead.

## Licence
All code is licenced under MIT.
