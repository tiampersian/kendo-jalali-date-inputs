import { addDays, addMonths, addWeeks } from '@progress/kendo-date-math';
import { Action, firstDayOfMonth, lastDayOfMonth } from '../kendo-util-overrides';
export const EMPTY_DATA = [[]];
export const CELLS_LENGTH = 7;
export const ROWS_LENGTH = 6;
const ACTIONS = {
  [Action.Left]: (date) => addDays(date, -1),
  [Action.Up]: (date) => addWeeks(date, -1),
  [Action.Right]: (date) => addDays(date, 1),
  [Action.Down]: (date) => addWeeks(date, 1),
  [Action.PrevView]: (date) => addMonths(date, -1),
  [Action.NextView]: (date) => addMonths(date, 1),
  [Action.FirstInView]: (date) => firstDayOfMonth(date),
  [Action.LastInView]: (date) => lastDayOfMonth(date)
};


