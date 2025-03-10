
import { addMonths, addYears, firstMonthOfYear, lastMonthOfYear } from '@progress/kendo-date-math';
import { Action } from '../kendo-util-overrides';


export const EMPTY_DATA = [[]];
export const CELLS_LENGTH = 4;
export const ROWS_LENGTH = 3;
const upStep = (month) => {
  if (month > 4) {
    return -5;
  }
  if (month < 2) {
    return -2;
  }
  return -7;
};
const downStep = (month) => {
  if (month < 7) {
    return 5;
  }
  if (month < 10) {
    return 7;
  }
  return 2;
};
const ACTIONS = {
  [Action.Left]: (date) => addMonths(date, -1),
  [Action.Up]: (date) => addMonths(date, upStep(date.getMonth())),
  [Action.Right]: (date) => addMonths(date, 1),
  [Action.Down]: (date) => addMonths(date, downStep(date.getMonth())),
  [Action.PrevView]: (date) => addYears(date, -1),
  [Action.NextView]: (date) => addYears(date, 1),
  [Action.FirstInView]: (date) => firstMonthOfYear(date),
  [Action.LastInView]: (date) => lastMonthOfYear(date)
};


