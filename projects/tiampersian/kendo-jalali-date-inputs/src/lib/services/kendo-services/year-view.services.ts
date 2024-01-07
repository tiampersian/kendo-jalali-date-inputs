import { CldrIntlService } from '@progress/kendo-angular-intl';

import { JalaliCldrIntlService } from '../jalali-cldr-intl.service';
import { Action, EMPTY_SELECTIONRANGE, firstMonthOfYear, getToday, isInSelectionRange, isPresent, lastDayOfMonth, lastMonthOfYear, range } from '../kendo-util-overrides';
import { addMonths, addYears, cloneDate, createDate, durationInYears, } from '@progress/kendo-date-math';


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

export class YearViewService {
  dateRange = (start, end) => {
    if (!isPresent(start) || !isPresent(end)) {
      return [];
    }
    const result = [];
    let current = start;
    while (current <= end) {
      result.push(current);
      current = addMonths(current, 1);
    }
    return result;
  };
  constructor(private _intl: JalaliCldrIntlService) {
    this._intl = _intl;
  }
  addToDate(min, skip) {
    return addYears(min, skip);
  }
  datesList(start, count) {
    return range(0, count).map(i => addYears(start, i));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const months = this.abbrMonthNames();
    const firstDate = firstMonthOfYear(viewDate, this._intl.localeId);
    const lastDate = lastMonthOfYear(viewDate, this._intl.localeId);
    const currentYear = firstDate.getFullYear();
    const cells = range(0, CELLS_LENGTH);
    const today = getToday();
    return range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addMonths(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this.normalize(addMonths(baseDate, cellOffset), min, max);
        const changedYear = currentYear < cellDate.getFullYear();
        if (!this.isInRange(cellDate, min, max) || changedYear) {
          return null;
        }
        const isRangeStart = this.isEqual(cellDate, selectionRange.start);
        const isRangeEnd = this.isEqual(cellDate, selectionRange.end);
        const isInMiddle = !isRangeStart && !isRangeEnd;
        const isRangeMid = isInMiddle && isInSelectionRange(cellDate, selectionRange);
        return {
          formattedValue: months[cellDate.getMonth()],
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
    return candidate.getFullYear() === expected.getFullYear() &&
      candidate.getMonth() === expected.getMonth();
  }
  isInArray(date, dates) {
    if (!dates.length) {
      return false;
    }
    const year = date.getFullYear();
    return dates[0].getFullYear() <= year && year <= dates[dates.length - 1].getFullYear();
  }
  isInRange(candidate, min, max) {
    const candidateValue = createDate(candidate.getFullYear(), candidate.getMonth(), 1);
    const aboveMin = !min || createDate(min.getFullYear(), min.getMonth(), 1) <= candidateValue;
    const belowMax = !max || candidateValue <= createDate(max.getFullYear(), max.getMonth(), 1);
    return aboveMin && belowMax;
  }
  beginningOfPeriod(date) {
    if (!date) {
      return date;
    }
    return createDate(date.getFullYear(), 0, 1);
  }
  lastDayOfPeriod(date) {
    const month = lastMonthOfYear(date);
    return lastDayOfMonth(month);
  }
  isRangeStart(value) {
    return value.getFullYear() % 10 === 0;
  }
  move(value, action) {
    const modifier = ACTIONS[action];
    if (!modifier) {
      return value;
    }
    return modifier(value);
  }
  cellTitle(value) {
    return `${value.getFullYear()} ${this.value(value)}`;
  }
  navigationTitle(value) {
    return this.title(value);
  }
  title(current) {
    return current ? current.getFullYear().toString() : '';
  }
  rowLength() {
    return CELLS_LENGTH;
  }
  skip(value, min) {
    return durationInYears(min, value);
  }
  total(min, max) {
    return durationInYears(min, max) + 1;
  }
  value(current) {
    return current ? this.abbrMonthNames()[current.getMonth()] : '';
  }
  viewDate(date, max, viewsCount = 1) {
    const viewsInRange = this.total(date, max);
    if (viewsInRange < viewsCount) {
      const yearsToSubtract = viewsCount - viewsInRange;
      return addYears(date, -1 * yearsToSubtract);
    }
    return date;
  }
  abbrMonthNames() {
    return this._intl.dateFormatNames({ nameType: 'abbreviated', type: 'months' });
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


