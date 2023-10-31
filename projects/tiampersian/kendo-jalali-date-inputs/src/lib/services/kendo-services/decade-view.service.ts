import { addDecades, addYears, cloneDate, createDate, durationInDecades, lastDayOfMonth, lastMonthOfYear } from '@progress/kendo-date-math';
import { Action, EMPTY_SELECTIONRANGE, firstYearOfDecade, getToday, isInSelectionRange, isPresent, lastYearOfDecade, range } from '../kendo-util-overrides';

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

export class DecadeViewService {
  dateRange = (start, end) => {
    if (!isPresent(start) || !isPresent(end)) {
      return [];
    }
    const result = [];
    let current = start;
    while (current <= end) {
      result.push(current);
      current = addYears(current, 1);
    }
    return result;
  };
  constructor() {
  }
  addToDate(min, skip) {
    return addDecades(min, skip);
  }
  datesList(start, count) {
    return range(0, count).map(i => addDecades(start, i));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstYearOfDecade(viewDate);
    const lastDate = lastYearOfDecade(viewDate);
    const today = getToday();
    return range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addYears(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this.normalize(addYears(baseDate, cellOffset), min, max);
        const nextDecade = cellDate.getFullYear() > lastDate.getFullYear();
        if (!this.isInRange(cellDate, min, max) || nextDecade) {
          return null;
        }
        const isRangeStart = this.isEqual(cellDate, selectionRange.start);
        const isRangeEnd = this.isEqual(cellDate, selectionRange.end);
        const isInMiddle = !isRangeStart && !isRangeEnd;
        const isRangeMid = isInMiddle && isInSelectionRange(cellDate, selectionRange);
        return {
          formattedValue: this.value(cellDate),
          id: `${cellUID}${cellDate.getTime()}`,
          isFocused: this.isEqual(cellDate, focusedDate),
          isSelected: isActiveView && selectedDates.some(date => this.isEqual(cellDate, date)),
          isWeekend: false,
          isRangeStart: isRangeStart,
          isRangeMid: isRangeMid,
          isRangeEnd: isRangeEnd,
          isRangeSplitEnd: isRangeMid && this.isEqual(cellDate, lastDate),
          isRangeSplitStart: isRangeMid && this.isEqual(cellDate, firstDate),
          isToday: this.isEqual(cellDate, today),
          title: this.cellTitle(cellDate),
          value: cellDate
        };
      });
    });
  }
  isEqual(candidate, expected) {
    if (!candidate || !expected) {
      return false;
    }
    return candidate.getFullYear() === expected.getFullYear();
  }
  isInArray(date, dates) {
    if (!dates.length) {
      return false;
    }
    const year = date.getFullYear();
    return dates[0].getFullYear() <= year && year <= (dates[dates.length - 1].getFullYear() + 9);
  }
  isInRange(candidate, min, max) {
    const year = candidate.getFullYear();
    const aboveMin = !min || min.getFullYear() <= year;
    const belowMax = !max || year <= max.getFullYear();
    return aboveMin && belowMax;
  }
  beginningOfPeriod(date) {
    if (!date) {
      return date;
    }
    const firstYear = firstYearOfDecade(date);
    return createDate(firstYear.getFullYear(), 0, 1);
  }
  lastDayOfPeriod(date) {
    const year = lastYearOfDecade(date);
    const month = lastMonthOfYear(year);
    return lastDayOfMonth(month);
  }
  isRangeStart(value) {
    return value.getFullYear() % 100 === 0;
  }
  move(value, action) {
    const modifier = ACTIONS[action];
    if (!modifier) {
      return value;
    }
    return modifier(value);
  }
  cellTitle(value) {
    return value.getFullYear().toString();
  }
  navigationTitle(value) {
    return value ? firstYearOfDecade(value).getFullYear().toString() : '';
  }
  title(value) {
    if (!value) {
      return '';
    }
    return `${firstYearOfDecade(value).getFullYear()} - ${lastYearOfDecade(value).getFullYear()}`;
  }
  rowLength() {
    return CELLS_LENGTH;
  }
  skip(value, min) {
    return durationInDecades(min, value);
  }
  total(min, max) {
    return durationInDecades(min, max) + 1;
  }
  value(current) {
    return current ? current.getFullYear().toString() : '';
  }
  viewDate(date, max, viewsCount = 1) {
    const viewsInRange = this.total(date, max);
    if (viewsInRange < viewsCount) {
      const decadesToSubtract = viewsCount - viewsInRange;
      return addDecades(date, -1 * decadesToSubtract);
    }
    return date;
  }
  normalize(cellDate, min, max) {
    if (cellDate < min && this.isEqual(cellDate, min)) {
      return cloneDate(min);
    }
    if (cellDate > max && this.isEqual(cellDate, max)) {
      return cloneDate(max);
    }
    return cellDate;
  }
}

