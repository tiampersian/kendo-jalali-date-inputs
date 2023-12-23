import { Inject, Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { addDays, addMonths, dayOfWeek, getDate } from '@progress/kendo-date-math';
import dayjs from 'dayjs';
import { firstDayOfMonth, getToday, isInSelectionRange, range, lastDayOfMonth } from './kendo-util-overrides';
import { JalaliCldrIntlService } from './jalali-cldr-intl.service';
import { MonthViewService, CELLS_LENGTH, EMPTY_DATA, ROWS_LENGTH } from './kendo-services/month-view.service';


@Injectable()
export class JalaliMonthViewService extends MonthViewService {
  constructor(
    @Inject(IntlService) protected intl: JalaliCldrIntlService
  ) {
    super(intl);
  }

  value(current) {
    if (!current) {
      return '';
    }
    const res = this.intl.getDayJsValue(current).format('DD').toString();
    return res;
  }

  abbrMonthNames2() {
    if (this.intl.isJalali) {
      return Array.from(Array(12).keys()).map((x, i) => {
        return this.intl.getDayJsValue('' + (i + 1)).format('MMMM');
      });
    }
    return this.intl.getDayJsValue().localeData().monthsShort();
  }

  navigationTitle(value) {
    if (!value) {
      return '';
    }

    if (this.isRangeStart(value)) {
      return this.intl.getDayJsValue(value).format('YYYY');
    }

    return this.abbrMonthNames2()[value.getMonth()];
  }

  isRangeStart(value) {
    if (!value) { return false; }

    return !this.intl.getDayJsValue(value).month();
  }

  title(current) {
    return `${this.abbrMonthNames2()[current.getMonth()]} ${this.intl.getDayJsValue(current).format('YYYY')}`;
  }

  skip(value, min) {
    const diff = this.intl.getDayJsValue(value).endOf('month').diff(
      this.intl.getDayJsValue(min).startOf('month'), 'month'
    );
    return diff;
  }
  rowLength(options = {}) {
    return CELLS_LENGTH + (options['prependCell'] ? 1 : 0);
  }
  total(min, max) {
    return dayjs(max).diff(min, 'month') + 1;
  }
  beginningOfPeriod(date) {
    if (!date) {
      return date;
    }
    return this.intl.getDayJsValue(date).startOf('month').toDate();
  }
  datesList(start, count) {
    return range(0, count).map(i => addMonths(start, i));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDate, selectionRange = [], viewDate, isDateDisabled = () => false } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const dateValue = this.intl.getDayJsValue(viewDate).toDate();
    const firstMonthDate = firstDayOfMonth(dateValue, this.intl.localeIdByDatePickerType);
    const firstMonthDay = getDate(firstMonthDate);
    const lastMonthDate = lastDayOfMonth(dateValue, this.intl.localeIdByDatePickerType);
    const lastMonthDay = getDate(lastMonthDate);
    const backward = -1;
    const isSelectedDateInRange = dayjs(selectedDate).isBetween(min, max);
    const date = dayOfWeek(firstMonthDate, this.intl.firstDay(), backward);
    const cells = range(0, CELLS_LENGTH);
    console.log('console', this.intl.firstDay())
    const today = getToday();
    return range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addDays(date, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this['normalize'](addDays(baseDate, cellOffset), min, max);
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
          isSelected: isActiveView && isSelectedDateInRange && this.isEqual(cellDate, selectedDate),
          isWeekend: this.isWeekend(cellDate),
          isRangeStart,
          isRangeMid,
          isRangeEnd,
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

}
