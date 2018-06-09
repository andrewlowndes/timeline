import * as moment from 'moment';

import { ITimelineEntry } from './TimelineEntry';
import { ITimelineConfig } from './TimelineConfig';

const defaultConfig: ITimelineConfig = {
  granularity: 'day',
  dateFormat: 'YYYY-MM-DD'
};

export class Timeline {
  private config: ITimelineConfig;
  private entries: Array<ITimelineEntry> = [];
  
  private dataEntriesCache: Array<ITimelineEntry> = [];
  private dataEntriesDirty: boolean = true;

  constructor(customConfig?: Partial<ITimelineConfig>) {
    this.config = { ...defaultConfig, ...customConfig };
  }

  addEntry(newEntry: ITimelineEntry) {
    this.entries.push(newEntry);
    this.dataEntriesDirty = true;
  }

  getEntryOn(date: string): ITimelineEntry | undefined {
    //note: could use binary search instead for massive amounts of entries
    return this._findEntry(this.getDateEntries(), date);
  }

  getDateEntries(): Array<ITimelineEntry> {
    if (!this.dataEntriesDirty) {
      return this.dataEntriesCache;
    }

    //get a flat list of entries in the timeline in date order, splitting any overlapping entries into multiple parts
    let dateEntries: Array<ITimelineEntry> = [];

    this.entries.forEach((entry) => this._mergeEntry(dateEntries, entry));
    
    this.dataEntriesCache = dateEntries;
    this.dataEntriesDirty = false;

    return dateEntries;
  }

  //warning: mutates the provided entry
  private _mergeEntry(entries: Array<ITimelineEntry>, entry: ITimelineEntry) {
    if (!entries.length || (!entry.startDate && !entry.endDate)) {
      entries.length = 0;
      entries.push(entry);
      return;
    }

    let endEntry = this._findEntry(entries, entry.endDate);

    const startEntry = this._findEntry(entries, entry.startDate),
      entryStartDate = this._date(entry.startDate),
      entryEndDate = this._date(entry.endDate),
      trimStart = startEntry && !!entry.startDate && (!startEntry.startDate || entryStartDate.isAfter(this._date(startEntry.startDate))),
      trimEnd = endEntry && !!entry.endDate && (!endEntry.endDate || entryEndDate.isBefore(this._date(endEntry.endDate)));

    //if we are dealing with the same entry then we will need to duplicate it
    if (trimStart && trimEnd && startEntry === endEntry) {
      endEntry = { ...endEntry };
      entries.splice(entries.indexOf(startEntry)+1, 0, endEntry);
    }

    //trim any existing entry that overlaps the start
    if (trimStart) {
      startEntry.endDate = this._formatDate(entryStartDate.subtract(1, this.config.granularity));
    }
    
    //do the same to the end entry if there is one
    if (trimEnd) {
      endEntry.startDate = this._formatDate(entryEndDate.add(1, this.config.granularity));
    }

    //find the place to insert our new entry so that the entries remain in order, then remove entries that are covered by the new entry
    const insertEntryIndex = this._findEntryInsertIndex(entries, entry);

    let checkIndex = entry.endDate ? insertEntryIndex : entries.length;
    while (checkIndex < entries.length && entries[checkIndex].endDate && this._date(entries[checkIndex].endDate).isBefore(entryEndDate)) {
      checkIndex++;
    }
    
    entries.splice(insertEntryIndex, checkIndex-insertEntryIndex, entry);

    if (!entry.startDate) {
      entries.splice(0, insertEntryIndex);
    }
  }

  private _formatDate(date: moment.Moment): string {
    return date.format(this.config.dateFormat);
  }

  private _date(date: string): moment.Moment {
    return moment(date, this.config.dateFormat).startOf(this.config.granularity);
  }

  private _findEntryInsertIndex(arr: Array<ITimelineEntry>, entry: ITimelineEntry): number {
    if (entry.startDate) {
      const entryStartDate = this._date(entry.startDate),
        startIndex = arr.findIndex((testEntry) => testEntry.startDate && this._date(testEntry.startDate).isAfter(entryStartDate));
      
      return startIndex < 0 ? arr.length : startIndex;
    }

    const entryEndDate = this._date(entry.endDate),
    startIndex = arr.findIndex((testEntry) => testEntry.startDate && this._date(testEntry.startDate).isAfter(entryEndDate));

    return startIndex < 0 ? arr.length : startIndex;
  }

  private _findEntry(arr: Array<ITimelineEntry>, date: string | undefined): ITimelineEntry | undefined {
    if (!date) {
      return;
    }

    const searchDate = this._date(date);

    return arr.find((entry) => this._inRange(searchDate, entry));
  }

  private _inRange(searchDate: moment.Moment, entry: ITimelineEntry): boolean {
    return (!entry.startDate || this._date(entry.startDate).isSameOrBefore(searchDate)) && 
      (!entry.endDate || this._date(entry.endDate).isSameOrAfter(searchDate));
  }
}
