import { addDecades, addYears } from '@progress/kendo-date-math';
import { Action, firstYearOfDecade, lastYearOfDecade } from '../kendo-util-overrides';

export const EMPTY_DATA = [[]];
export const CELLS_LENGTH = 4;
export const ROWS_LENGTH = 3;
const ACTIONS = {
  [Action.Left]: (date) => addYears(date, -1),
  [Action.Up]: (date) => addYears(date, -5),
  [Action.Right]: (date) => addYears(date, 1),
  [Action.Down]: (date) => addYears(date, 5),
  [Action.PrevView]: (date) => addDecades(date, -1),
  [Action.NextView]: (date) => addDecades(date, 1),
  [Action.FirstInView]: (date) => firstYearOfDecade(date),
  [Action.LastInView]: (date) => lastYearOfDecade(date)
};


