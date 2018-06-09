import { Timeline } from './Timeline';
import { ITimelineEntry } from './TimelineEntry';

describe('Timeline', () => {
  let timeline: Timeline;

  beforeEach(() => {
    timeline = new Timeline();
  });

  describe('when there is an empty timeline', () => {
    it('should return an empty list of date entries', () => {
      expect(timeline.getDateEntries()).toEqual([]);
    });

    it('should not return and results when fetching an entry for a specific date', () => {
      expect(timeline.getEntryOn('2018-06-05')).toBeUndefined();
    });
  });

  describe('when adding the first entry', () => {
    let firstEntry: ITimelineEntry;

    describe('when the first entry has explicit start and end dates', () => {
      beforeEach(() => {
        firstEntry = {
          startDate: '2018-06-05',
          endDate: '2018-06-07',
          value: 'first'
        };

        timeline.addEntry(firstEntry);
      });

      it('should return the single result when fetching a list of all date entries', () => {
        expect(timeline.getDateEntries()).toEqual([firstEntry]);
      });

      it('should not return anything when querying an entry before the start date', () => {
        expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
      });

      it('should return the entry when querying between the start and end dates', () => {
        expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
      });

      it('should not return anything when querying an entry after the end date', () => {
        expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
      });

      it('should return the cached results when reading the entries multiple times', () => {
        expect(timeline.getDateEntries()).toBe(timeline.getDateEntries());
      });

      describe('when adding a second entry', () => {
        let secondEntry: ITimelineEntry;

        describe('when the second entry has explicit start and end dates', () => {
          describe('when it starts after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2019-03-01',
                endDate: '2019-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([firstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
              expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
            });
  
            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-07',
                    endDate: '2019-03-01',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      endDate: '2018-06-06'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      startDate: '2019-03-02'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newFirstEntry, thirdEntry, newSecondEntry]);
                  expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2019-01-02',
                    endDate: '2019-01-03',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([firstEntry, thirdEntry, secondEntry]);
                  expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2019-01-01')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-01-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
                });
              });
            });
          });
  
          describe('when it ends before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-03-01',
                endDate: '2018-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry]);
              expect(timeline.getEntryOn('2018-01-01')).toBeUndefined();
              expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });
          });
  
          describe('when it starts within and ends after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-06',
                endDate: '2018-06-09',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the end date of the entry and insert the new entry after', () => {
              let newFirstEntry = {
                ...firstEntry,
                endDate: '2018-06-05'
              };
  
              expect(timeline.getDateEntries()).toEqual([newFirstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-10')).toBeUndefined();
            });
          });
  
          describe('when it ends within and starts before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-02',
                endDate: '2018-06-06',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the start date of the entry and insert the new entry before', () => {
              let newFirstEntry = {
                ...firstEntry,
                startDate: '2018-06-07'
              };
  
              expect(timeline.getDateEntries()).toEqual([secondEntry, newFirstEntry]);
              expect(timeline.getEntryOn('2018-06-01')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });
          });
  
          describe('when it starts and ends within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-06',
                endDate: '2018-06-06',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should split the entry into two, trim the dates and insert the new entry between them', () => {
              let firstPartEntry = {
                  ...firstEntry,
                  endDate: '2018-06-05'
                },
                secondPartEntry = {
                  ...firstEntry,
                  startDate: '2018-06-07'
                };
              
              expect(timeline.getDateEntries()).toEqual([firstPartEntry, secondEntry, secondPartEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstPartEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondPartEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });
          });
  
          describe('when the new entry covers the old entry completely', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-03',
                endDate: '2018-06-08',
                value: 'second'
              };
  
              timeline.addEntry(secondEntry);
            });
  
            it('should replace the existing entry', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry]);
              expect(timeline.getEntryOn('2018-06-02')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toBeUndefined();
            });
          });
        });

        describe('when the second entry has an open-ended start date', () => {
          describe('when it ends after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2019-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('the second entry should override the first entry', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
            });
          });
  
          describe('when it ends before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2018-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry]);
              expect(timeline.getEntryOn('2018-01-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });

            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-02',
                    endDate: '2018-06-06',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      startDate: '2018-06-07'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      endDate: '2018-06-01'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newSecondEntry, thirdEntry, newFirstEntry]);
                  expect(timeline.getEntryOn('2018-06-01')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2018-06-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-04')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2019-01-02',
                    endDate: '2019-01-03',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry, thirdEntry]);
                  expect(timeline.getEntryOn('2018-01-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-01-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-04')).toBeUndefined();
                });
              });
            });
          });
  
          describe('when it ends within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2018-06-06',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the start date of the entry and insert the new entry before', () => {
              let newFirstEntry = {
                ...firstEntry,
                startDate: '2018-06-07'
              };
  
              expect(timeline.getDateEntries()).toEqual([secondEntry, newFirstEntry]);
              expect(timeline.getEntryOn('2018-06-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });
          });
        });

        describe('when the second entry has an open-ended end date', () => {
          describe('when it starts after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2019-03-01',
                endDate: undefined,
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([firstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
              expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-04')).toEqual(secondEntry);
            });
  
            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-07',
                    endDate: '2019-03-01',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      endDate: '2018-06-06'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      startDate: '2019-03-02'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newFirstEntry, thirdEntry, newSecondEntry]);
                  expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toEqual(newSecondEntry);
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2019-01-02',
                    endDate: '2019-01-03',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([firstEntry, thirdEntry, secondEntry]);
                  expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2019-01-01')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-01-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toEqual(secondEntry);
                });
              });
            });
          });
  
          describe('when it starts within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-06',
                endDate: undefined,
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the end date of the entry and insert the new entry after', () => {
              let newFirstEntry = {
                ...firstEntry,
                endDate: '2018-06-05'
              };
  
              expect(timeline.getDateEntries()).toEqual([newFirstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-10')).toEqual(secondEntry);
            });
          });
  
          describe('when it starts before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-03',
                endDate: undefined,
                value: 'second'
              };
  
              timeline.addEntry(secondEntry);
            });
  
            it('should replace the existing entry', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry]);
              expect(timeline.getEntryOn('2018-06-02')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
            });
          });
        });

        describe('when the second entry has open ended start and end dates', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: undefined,
              endDate: undefined,
              value: 'second'
            };

            timeline.addEntry(secondEntry);
          });

          it('should replace the existing entry', () => {
            expect(timeline.getDateEntries()).toEqual([secondEntry]);
            expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
          });
        });
      });
    });

    describe('when the first entry has an open ended start date', () => {
      beforeEach(() => {
        firstEntry = {
          startDate: undefined,
          endDate: '2018-06-07',
          value: 'first'
        };

        timeline.addEntry(firstEntry);
      });

      it('should return the single result when fetching a list of all date entries', () => {
        expect(timeline.getDateEntries()).toEqual([firstEntry]);
      });

      it('should return the entry when querying the end date or before', () => {
        expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
      });

      describe('when adding a second entry', () => {
        let secondEntry: ITimelineEntry;

        describe('when the second entry has explicit start and end dates', () => {
          describe('when it starts after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2019-03-01',
                endDate: '2019-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([firstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
              expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
            });
  
            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-07',
                    endDate: '2019-03-01',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      endDate: '2018-06-06'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      startDate: '2019-03-02'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newFirstEntry, thirdEntry, newSecondEntry]);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2019-01-02',
                    endDate: '2019-01-03',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([firstEntry, thirdEntry, secondEntry]);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2019-01-01')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-01-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
                });
              });
            });
          });
  
          describe('when it starts within and ends after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-06',
                endDate: '2018-06-09',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the end date of the entry and insert the new entry after', () => {
              let newFirstEntry = {
                ...firstEntry,
                endDate: '2018-06-05'
              };
  
              expect(timeline.getDateEntries()).toEqual([newFirstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-10')).toBeUndefined();
            });
          });
        });

        describe('when the second entry has an open-ended start date', () => {
          describe('when it ends after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2019-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('the second entry should override the first entry', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-04')).toBeUndefined();
            });
          });
  
          describe('when it ends before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2018-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry]);
              expect(timeline.getEntryOn('2018-01-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });

            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-02',
                    endDate: '2018-06-06',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      startDate: '2018-06-07'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      endDate: '2018-06-01'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newSecondEntry, thirdEntry, newFirstEntry]);
                  expect(timeline.getEntryOn('2018-06-01')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2018-06-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-04')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2019-01-02',
                    endDate: '2019-01-03',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry, thirdEntry]);
                  expect(timeline.getEntryOn('2018-01-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-04')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
                  expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-01-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-04')).toBeUndefined();
                });
              });
            });
          });
  
          describe('when it ends within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2018-06-06',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the start date of the entry and insert the new entry before', () => {
              let newFirstEntry = {
                ...firstEntry,
                startDate: '2018-06-07'
              };
  
              expect(timeline.getDateEntries()).toEqual([secondEntry, newFirstEntry]);
              expect(timeline.getEntryOn('2018-06-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
            });
          });
        });

        describe('when the second entry has an open-ended end date', () => {
          describe('when it starts after the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2019-03-01',
                endDate: undefined,
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([firstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toBeUndefined();
              expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2019-06-04')).toEqual(secondEntry);
            });
  
            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-07',
                    endDate: '2019-03-01',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      endDate: '2018-06-06'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      startDate: '2019-03-02'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newFirstEntry, thirdEntry, newSecondEntry]);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(newFirstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-08')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toEqual(newSecondEntry);
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2019-01-02',
                    endDate: '2019-01-03',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([firstEntry, thirdEntry, secondEntry]);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2019-01-01')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-01-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2019-01-04')).toBeUndefined();
                  expect(timeline.getEntryOn('2019-03-01')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-03-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2019-06-04')).toEqual(secondEntry);
                });
              });
            });
          });
  
          describe('when it starts within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-06',
                endDate: undefined,
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the end date of the first entry and insert the second entry after', () => {
              let newFirstEntry = {
                ...firstEntry,
                endDate: '2018-06-05'
              };
  
              expect(timeline.getDateEntries()).toEqual([newFirstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-10')).toEqual(secondEntry);
            });
          });
        });

        describe('when the second entry has open ended start and end dates', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: undefined,
              endDate: undefined,
              value: 'second'
            };

            timeline.addEntry(secondEntry);
          });

          it('should replace the existing entry', () => {
            expect(timeline.getDateEntries()).toEqual([secondEntry]);
            expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
          });
        });
      });
    });

    describe('when the first entry has an open ended end date', () => {
      beforeEach(() => {
        firstEntry = {
          startDate: '2018-06-05',
          endDate: undefined,
          value: 'first'
        };

        timeline.addEntry(firstEntry);
      });

      it('should return the single result when fetching a list of all date entries', () => {
        expect(timeline.getDateEntries()).toEqual([firstEntry]);
      });

      it('should not return anything when querying an entry before the start date', () => {
        expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
      });

      it('should return the entry when querying between the start and end dates', () => {
        expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
      });

      describe('when adding a second entry', () => {
        let secondEntry: ITimelineEntry;

        describe('when the second entry has explicit start and end dates', () => { 
          describe('when it ends before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-03-01',
                endDate: '2018-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry]);
              expect(timeline.getEntryOn('2018-01-01')).toBeUndefined();
              expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
            });
          });
  
          describe('when it ends within and starts before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-02',
                endDate: '2018-06-06',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the start date of the entry and insert the new entry before', () => {
              let newFirstEntry = {
                ...firstEntry,
                startDate: '2018-06-07'
              };
  
              expect(timeline.getDateEntries()).toEqual([secondEntry, newFirstEntry]);
              expect(timeline.getEntryOn('2018-06-01')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(newFirstEntry);
            });
          });
        });

        describe('when the second entry has an open-ended start date', () => {
          describe('when it ends before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2018-06-03',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should return both entries correctly when querying', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry, firstEntry]);
              expect(timeline.getEntryOn('2018-01-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-03-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
            });

            describe('when a third entry is added', () => {
              let thirdEntry: ITimelineEntry;
  
              describe('when it intersects both of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-02',
                    endDate: '2018-06-06',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should trim both of the existing entries and insert the new entry between', () => {
                  let newFirstEntry = {
                      ...firstEntry,
                      startDate: '2018-06-07'
                    },
                    newSecondEntry = {
                      ...secondEntry,
                      endDate: '2018-06-01'
                    };
  
                  expect(timeline.getDateEntries()).toEqual([newSecondEntry, thirdEntry, newFirstEntry]);
                  expect(timeline.getEntryOn('2018-06-01')).toEqual(newSecondEntry);
                  expect(timeline.getEntryOn('2018-06-02')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-03')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-04')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
                });
              });
  
              describe('when it does not intersect either of the existing entries', () => {
                beforeEach(() => {
                  thirdEntry = {
                    startDate: '2018-06-04',
                    endDate: '2018-06-04',
                    value: 'third'
                  };
          
                  timeline.addEntry(thirdEntry);
                });
        
                it('should insert the new entry between the other entries', () => {
                  expect(timeline.getDateEntries()).toEqual([secondEntry, thirdEntry, firstEntry]);
                  expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
                  expect(timeline.getEntryOn('2018-06-04')).toEqual(thirdEntry);
                  expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
                  expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
                });
              });
            });
          });
  
          describe('when it ends within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: undefined,
                endDate: '2018-06-06',
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the start date of the entry and insert the new entry before', () => {
              let newFirstEntry = {
                ...firstEntry,
                startDate: '2018-06-07'
              };
  
              expect(timeline.getDateEntries()).toEqual([secondEntry, newFirstEntry]);
              expect(timeline.getEntryOn('2018-06-01')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(newFirstEntry);
            });
          });
        });

        describe('when the second entry has an open-ended end date', () => {
          describe('when it starts within the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-06',
                endDate: undefined,
                value: 'second'
              };
      
              timeline.addEntry(secondEntry);
            });
  
            it('should alter the end date of the entry and insert the new entry after', () => {
              let newFirstEntry = {
                ...firstEntry,
                endDate: '2018-06-05'
              };
  
              expect(timeline.getDateEntries()).toEqual([newFirstEntry, secondEntry]);
              expect(timeline.getEntryOn('2018-06-04')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-05')).toEqual(newFirstEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-10')).toEqual(secondEntry);
            });
          });
  
          describe('when it starts before the first entry', () => {
            beforeEach(() => {
              secondEntry = {
                startDate: '2018-06-03',
                endDate: undefined,
                value: 'second'
              };
  
              timeline.addEntry(secondEntry);
            });
  
            it('should replace the existing entry', () => {
              expect(timeline.getDateEntries()).toEqual([secondEntry]);
              expect(timeline.getEntryOn('2018-06-02')).toBeUndefined();
              expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
              expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
            });
          });
        });

        describe('when the second entry has an open ended start and end dates', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: undefined,
              endDate: undefined,
              value: 'second'
            };

            timeline.addEntry(secondEntry);
          });

          it('should replace the existing entry', () => {
            expect(timeline.getDateEntries()).toEqual([secondEntry]);
            expect(timeline.getEntryOn('2018-06-02')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-09')).toEqual(secondEntry);
          });
        });
      });
    });

    describe('when the first entry has open ended start and end dates', () => {
      beforeEach(() => {
        firstEntry = {
          startDate: undefined,
          endDate: undefined,
          value: 'first'
        };

        timeline.addEntry(firstEntry);
      });

      it('should return the single result when fetching a list of all date entries', () => {
        expect(timeline.getDateEntries()).toEqual([firstEntry]);
      });

      it('should return the entry when querying between the start and end dates', () => {
        expect(timeline.getEntryOn('2018-06-05')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-06')).toEqual(firstEntry);
        expect(timeline.getEntryOn('2018-06-07')).toEqual(firstEntry);
      });

      describe('when adding a second entry', () => {
        let secondEntry: ITimelineEntry;

        describe('when the second entry has explicit start and end dates', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: '2018-06-04',
              endDate: '2018-06-06',
              value: 'second'
            };
    
            timeline.addEntry(secondEntry);
          });

          it('should split the first entry into two and return all three entries', () => {
            let firstPart = {
                ...firstEntry,
                endDate: '2018-06-03'
              },
              secondPart = {
                ...firstEntry,
                startDate: '2018-06-07'
              };

            expect(timeline.getDateEntries()).toEqual([firstPart, secondEntry, secondPart]);
            expect(timeline.getEntryOn('2018-06-02')).toEqual(firstPart);
            expect(timeline.getEntryOn('2018-06-03')).toEqual(firstPart);
            expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(secondPart);
            expect(timeline.getEntryOn('2018-06-08')).toEqual(secondPart);
          });
        });

        describe('when the second entry has an open-ended start date', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: undefined,
              endDate: '2018-06-06',
              value: 'second'
            };
    
            timeline.addEntry(secondEntry);
          });

          it('should split the first entry and put the second entry first', () => {
            let firstPart = {
              ...firstEntry,
              startDate: '2018-06-07'
            };

            expect(timeline.getDateEntries()).toEqual([secondEntry, firstPart]);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(firstPart);
            expect(timeline.getEntryOn('2018-06-08')).toEqual(firstPart);
          });
        });

        describe('when the second entry has an open-ended end date', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: '2018-06-06',
              endDate: undefined,
              value: 'second'
            };
    
            timeline.addEntry(secondEntry);
          });

          it('should split the first entry and put the second entry last', () => {
            let firstPart = {
              ...firstEntry,
              endDate: '2018-06-05'
            };

            expect(timeline.getDateEntries()).toEqual([firstPart, secondEntry]);
            expect(timeline.getEntryOn('2018-06-04')).toEqual(firstPart);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(firstPart);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
          });
        });

        describe('when the second entry has open ended start and end dates', () => {
          beforeEach(() => {
            secondEntry = {
              startDate: undefined,
              endDate: undefined,
              value: 'second'
            };

            timeline.addEntry(secondEntry);
          });

          it('should replace the existing entry', () => {
            expect(timeline.getDateEntries()).toEqual([secondEntry]);
            expect(timeline.getEntryOn('2018-06-03')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-04')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-05')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-06')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-07')).toEqual(secondEntry);
            expect(timeline.getEntryOn('2018-06-08')).toEqual(secondEntry);
          });
        });
      });
    });
  });
});
