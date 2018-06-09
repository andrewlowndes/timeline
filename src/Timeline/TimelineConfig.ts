import { unitOfTime } from 'moment';

export interface ITimelineConfig {
  granularity: unitOfTime.DurationAs;
  dateFormat: string;
}
