import { ITimelineEntry } from './TimelineEntry';
import { ITimelineConfig } from './TimelineConfig';
export declare class Timeline {
    private config;
    private entries;
    private dataEntriesCache;
    private dataEntriesDirty;
    constructor(customConfig?: Partial<ITimelineConfig>);
    addEntry(newEntry: ITimelineEntry): void;
    getEntryOn(date: string): ITimelineEntry | undefined;
    getDateEntries(): Array<ITimelineEntry>;
    private _mergeEntry;
    private _formatDate;
    private _date;
    private _findEntryInsertIndex;
    private _findEntry;
    private _inRange;
}
