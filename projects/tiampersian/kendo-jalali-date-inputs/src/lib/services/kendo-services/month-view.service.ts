import { CldrIntlService } from '@progress/kendo-angular-intl';
import { addDays, addWeeks, addMonths, cloneDate, dayOfWeek, durationInMonths, getDate, createDate } from '@progress/kendo-date-math';
import localeData from 'dayjs/plugin/localeData';
import { firstDayOfMonth, getToday, isInSelectionRange, range, lastDayOfMonth, Action, isPresent, EMPTY_SELECTIONRANGE } from '../kendo-util-overrides';
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
export class MonthViewService {
  dateRange = (start, end) => {
    if (!isPresent(start) || !isPresent(end)) {
      return [];
    }
    const result = [];
    let current = start;
    while (current <= end) {
      result.push(current);
      current = addDays(current, 1);
    }
    return result;
  };

  constructor(private _intl) {
  }
  addToDate(min, skip) {
    return addMonths(min, skip);
  }
  datesList(start, count) {
    return range(0, count).map(i => addMonths(start, i));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate, isDateDisabled = () => false } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const firstMonthDate = firstDayOfMonth(viewDate);
    const firstMonthDay = getDate(firstMonthDate);
    const lastMonthDate = lastDayOfMonth(viewDate);
    const lastMonthDay = getDate(lastMonthDate);
    const backward = -1;
    const date = dayOfWeek(firstMonthDate, this._intl.firstDay(), backward);
    const cells = range(0, CELLS_LENGTH);
    const today = getToday();
    return range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addDays(date, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this.normalize(addDays(baseDate, cellOffset), min, max);
        const cellDay = getDate(cellDate);
        const otherMonth = cellDay < firstMonthDay || cellDay > lastMonthDay;
        const outOfRange = cellDate < min || cellDate > max;
        if (outOfRange) {
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
          isWeekend: this.isWeekend(cellDate),
          isRangeStart: isRangeStart,
          isRangeMid: isRangeMid,
          isRangeEnd: isRangeEnd,
          isRangeSplitStart: isRangeMid && this.isEqual(cellDate, firstMonthDate),
          isRangeSplitEnd: isRangeMid && this.isEqual(cellDate, lastMonthDate),
          isToday: this.isEqual(cellDate, today),
          title: this.cellTitle(cellDate),
          value: cellDate,
          isDisabled: isDateDisabled(cellDate),
          isOtherMonth: otherMonth
        };
      });
    });
  }
  isEqual(candidate, expected) {
    if (!candidate || !expected) {
      return false;
    }
    return getDate(candidate).getTime() === getDate(expected).getTime();
  }
  isInArray(date, dates) {
    if (dates.length === 0) {
      return false;
    }
    const lowerBound = this.beginningOfPeriod(dates[0]);
    const upperBound = this.beginningOfPeriod(addMonths(dates[dates.length - 1], 1));
    return lowerBound <= date && date < upperBound;
  }
  isInRange(candidate, min, max) {
    const value = getDate(candidate);
    const aboveMin = !min || getDate(min) <= value;
    const belowMax = !max || value <= getDate(max);
    return aboveMin && belowMax;
  }
  beginningOfPeriod(date) {
    if (!date) {
      return date;
    }
    return createDate(date.getFullYear(), date.getMonth(), 1);
  }
  lastDayOfPeriod(date) {
    return lastDayOfMonth(date);
  }
  isRangeStart(value) {
    return !value.getMonth();
  }
  move(value, action) {
    const modifier = ACTIONS[action];
    if (!modifier) {
      return value;
    }
    return modifier(value);
  }
  cellTitle(value) {
    return this._intl.formatDate(value, 'D');
  }
  navigationTitle(value) {
    if (!value) {
      return '';
    }
    return this.isRangeStart(value) ? value.getFullYear().toString() : this.abbrMonthNames()[value.getMonth()];
  }
  title(current) {
    return `${this.wideMonthNames()[current.getMonth()]} ${current.getFullYear()}`;
  }
  rowLength(options = {}) {
    return CELLS_LENGTH + ((options as any).prependCell ? 1 : 0);
  }
  skip(value, min) {
    return durationInMonths(min, value);
  }
  total(min, max) {
    return durationInMonths(min, max) + 1;
  }
  value(current) {
    return current ? current.getDate().toString() : "";
  }
  viewDate(date, max, viewsCount = 1) {
    const viewsInRange = this.total(date, max);
    if (viewsInRange < viewsCount) {
      const monthsToSubtract = viewsCount - viewsInRange;
      return addMonths(date, -1 * monthsToSubtract);
    }
    return date;
  }
  isWeekend(date) {
    const { start, end } = this._intl.weekendRange();
    const day = date.getDay();
    if (end < start) {
      return day <= end || start <= day;
    }
    return start <= day && day <= end;
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
  wideMonthNames() {
    return this._intl.dateFormatNames({ nameType: 'wide', type: 'months' });
  }
}


