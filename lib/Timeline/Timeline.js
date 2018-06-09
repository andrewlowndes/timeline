"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var defaultConfig = {
    granularity: 'day',
    dateFormat: 'YYYY-MM-DD'
};
var Timeline = (function () {
    function Timeline(customConfig) {
        this.entries = [];
        this.dataEntriesCache = [];
        this.dataEntriesDirty = true;
        this.config = __assign({}, defaultConfig, customConfig);
    }
    Timeline.prototype.addEntry = function (newEntry) {
        this.entries.push(newEntry);
        this.dataEntriesDirty = true;
    };
    Timeline.prototype.getEntryOn = function (date) {
        return this._findEntry(this.getDateEntries(), date);
    };
    Timeline.prototype.getDateEntries = function () {
        var _this = this;
        if (!this.dataEntriesDirty) {
            return this.dataEntriesCache;
        }
        var dateEntries = [];
        this.entries.forEach(function (entry) { return _this._mergeEntry(dateEntries, entry); });
        this.dataEntriesCache = dateEntries;
        this.dataEntriesDirty = false;
        return dateEntries;
    };
    Timeline.prototype._mergeEntry = function (entries, entry) {
        if (!entries.length || (!entry.startDate && !entry.endDate)) {
            entries.length = 0;
            entries.push(entry);
            return;
        }
        var endEntry = this._findEntry(entries, entry.endDate);
        var startEntry = this._findEntry(entries, entry.startDate), entryStartDate = this._date(entry.startDate), entryEndDate = this._date(entry.endDate), trimStart = startEntry && !!entry.startDate && (!startEntry.startDate || entryStartDate.isAfter(this._date(startEntry.startDate))), trimEnd = endEntry && !!entry.endDate && (!endEntry.endDate || entryEndDate.isBefore(this._date(endEntry.endDate)));
        if (trimStart && trimEnd && startEntry === endEntry) {
            endEntry = __assign({}, endEntry);
            entries.splice(entries.indexOf(startEntry) + 1, 0, endEntry);
        }
        if (trimStart) {
            startEntry.endDate = this._formatDate(entryStartDate.subtract(1, this.config.granularity));
        }
        if (trimEnd) {
            endEntry.startDate = this._formatDate(entryEndDate.add(1, this.config.granularity));
        }
        var insertEntryIndex = this._findEntryInsertIndex(entries, entry);
        var checkIndex = entry.endDate ? insertEntryIndex : entries.length;
        while (checkIndex < entries.length && entries[checkIndex].endDate && this._date(entries[checkIndex].endDate).isBefore(entryEndDate)) {
            checkIndex++;
        }
        entries.splice(insertEntryIndex, checkIndex - insertEntryIndex, entry);
        if (!entry.startDate) {
            entries.splice(0, insertEntryIndex);
        }
    };
    Timeline.prototype._formatDate = function (date) {
        return date.format(this.config.dateFormat);
    };
    Timeline.prototype._date = function (date) {
        return moment(date, this.config.dateFormat).startOf(this.config.granularity);
    };
    Timeline.prototype._findEntryInsertIndex = function (arr, entry) {
        var _this = this;
        if (entry.startDate) {
            var entryStartDate_1 = this._date(entry.startDate), startIndex_1 = arr.findIndex(function (testEntry) { return testEntry.startDate && _this._date(testEntry.startDate).isAfter(entryStartDate_1); });
            return startIndex_1 < 0 ? arr.length : startIndex_1;
        }
        var entryEndDate = this._date(entry.endDate), startIndex = arr.findIndex(function (testEntry) { return testEntry.startDate && _this._date(testEntry.startDate).isAfter(entryEndDate); });
        return startIndex < 0 ? arr.length : startIndex;
    };
    Timeline.prototype._findEntry = function (arr, date) {
        var _this = this;
        if (!date) {
            return;
        }
        var searchDate = this._date(date);
        return arr.find(function (entry) { return _this._inRange(searchDate, entry); });
    };
    Timeline.prototype._inRange = function (searchDate, entry) {
        return (!entry.startDate || this._date(entry.startDate).isSameOrBefore(searchDate)) &&
            (!entry.endDate || this._date(entry.endDate).isSameOrAfter(searchDate));
    };
    return Timeline;
}());
exports.Timeline = Timeline;
