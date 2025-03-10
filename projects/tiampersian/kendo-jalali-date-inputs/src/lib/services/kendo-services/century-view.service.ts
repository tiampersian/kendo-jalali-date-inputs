import { addCenturies, addDecades } from '@progress/kendo-date-math';
import { Action, firstDecadeOfCentury, lastDecadeOfCentury } from '../kendo-util-overrides';
export const EMPTY_DATA = [[]];
export const CELLS_LENGTH = 4;
export const ROWS_LENGTH = 3;
const ACTIONS = {
  [Action.Left]: (date) => addDecades(date, -1),
  [Action.Up]: (date) => addDecades(date, -5),
  [Action.Right]: (date) => addDecades(date, 1),
  [Action.Down]: (date) => addDecades(date, 5),
  [Action.PrevView]: (date) => addCenturies(date, -1),
  [Action.NextView]: (date) => addCenturies(date, 1),
  [Action.FirstInView]: (date) => firstDecadeOfCentury(date),
  [Action.LastInView]: (date) => lastDecadeOfCentury(date)
};


