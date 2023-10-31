import { addCenturies, addDecades, cloneDate, createDate, durationInCenturies, lastDayOfMonth, lastMonthOfYear, lastYearOfDecade } from '@progress/kendo-date-math';
import { Action, EMPTY_SELECTIONRANGE, firstDecadeOfCentury, firstYearOfDecade, getToday, isInSelectionRange, isPresent, lastDecadeOfCentury, range } from '../kendo-util-overrides';
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

export class CenturyViewService {
  dateRange = (start, end) => {
    if (!isPresent(start) || !isPresent(end)) {
      return [];
    }
    const result = [];
    let current = start;
    while (current <= end) {
      result.push(current);
      current = addDecades(current, 1);
    }
    return result;
  };
  constructor() {
  }
  addToDate(min, skip) {
    return addCenturies(min, skip);
  }
  datesList(start, count) {
    return range(0, count).map(i => addCenturies(start, i));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstDecadeOfCentury(viewDate);
    const lastDate = lastDecadeOfCentury(viewDate);
    const today = getToday();
    return range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addDecades(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this.normalize(addDecades(baseDate, cellOffset), min, max);
        const nextCentury = cellDate.getFullYear() > lastDate.getFullYear();
        if (!this.isInRange(cellDate, min, max) || nextCentury) {
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
    return firstYearOfDecade(candidate).getFullYear() === firstYearOfDecade(expected).getFullYear();
  }
  isInArray(date, dates) {
    if (!dates.length) {
      return false;
    }
    const year = date.getFullYear();
    return dates[0].getFullYear() <= year && year <= (dates[dates.length - 1].getFullYear() + 99);
  }
  isInRange(candidate, min, max) {
    const year = firstYearOfDecade(candidate).getFullYear();
    const aboveMin = !min || firstYearOfDecade(min).getFullYear() <= year;
    const belowMax = !max || year <= firstYearOfDecade(max).getFullYear();
    return aboveMin && belowMax;
  }
  beginningOfPeriod(date) {
    if (!date) {
      return date;
    }
    const firstYear = firstYearOfDecade(firstDecadeOfCentury(date));
    return createDate(firstYear.getFullYear(), 0, 1);
  }
  lastDayOfPeriod(date) {
    const decade = lastDecadeOfCentury(date);
    const year = lastYearOfDecade(decade);
    const month = lastMonthOfYear(year);
    return lastDayOfMonth(month);
  }
  isRangeStart(value) {
    return value.getFullYear() % 1000 === 0;
  }
  move(value, action) {
    const modifier = ACTIONS[action];
    if (!modifier) {
      return value;
    }
    return modifier(value);
  }
  cellTitle(value) {
    return firstYearOfDecade(value).getFullYear().toString();
  }
  navigationTitle(value) {
    return value ? firstDecadeOfCentury(value).getFullYear().toString() : '';
  }
  title(value) {
    if (!value) {
      return '';
    }
    return `${firstDecadeOfCentury(value).getFullYear()} - ${lastDecadeOfCentury(value).getFullYear()}`;
  }
  rowLength() {
    return CELLS_LENGTH;
  }
  skip(value, min) {
    return durationInCenturies(min, value);
  }
  total(min, max) {
    return durationInCenturies(min, max) + 1;
  }
  value(current) {
    return current ? firstYearOfDecade(current).getFullYear().toString() : '';
  }
  viewDate(date, max, viewsCount = 1) {
    const viewsInRange = this.total(date, max);
    if (viewsInRange < viewsCount) {
      const centuriesToSubtract = viewsCount - viewsInRange;
      return addCenturies(date, -1 * centuriesToSubtract);
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

