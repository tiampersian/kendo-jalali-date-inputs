import { Inject, Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import dayjs from 'dayjs';
import { firstDayOfMonth, getToday, isInSelectionRange, range, lastDayOfMonth, addMonths, startOfDay, addDays, addWeeks, EMPTY_SELECTIONRANGE, endOfDay, durationInMonths } from './kendo-util-overrides';
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
      return this.intl.jalaliMonths;
    }
    return this.intl.gregorianMonths;
  }

  navigationTitle(value) {
    if (!value) {
      return '';
    }

    if (this.isRangeStart(value)) {
      return this.intl.getDayJsValue(value).format('YYYY');
    }

    return this.abbrMonthNames2()[this.intl.getDayJsValue(value).month()];
  }

  isRangeStart(value) {
    if (!value) { return false; }

    return !this.intl.getDayJsValue(value).month();
  }

  title(current) {
    return `${this.abbrMonthNames2()[this.intl.getDayJsValue(current).month()]} ${this.intl.getDayJsValue(current).format('YYYY')}`;
  }

  skip(value, min) {
    return durationInMonths(min, value, this.intl.localeIdByDatePickerType);
  }
  rowLength(options = {}) {
    return CELLS_LENGTH + (options['prependCell'] ? 1 : 0);
  }
  total(min, max) {
    return durationInMonths(min, max, this.intl.localeIdByDatePickerType) + 1;
  }
  beginningOfPeriod(date) {
    if (!date) {
      return date;
    }
    return this.intl.getDayJsValue(date).startOf('month').toDate();
  }
  datesList(start, count) {
    return range(0, count).map(i => addMonths(start, i, this.intl.localeIdByDatePickerType));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate, isDateDisabled = () => false } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const dateValue = this.intl.getDayJsValue(viewDate).toDate();
    const lastMonthDate = lastDayOfMonth(dateValue, this.intl.localeIdByDatePickerType);
    const lastMonthDay = startOfDay(lastMonthDate, this.intl.localeIdByDatePickerType);
    const firstMonthDate = firstDayOfMonth(viewDate, this.intl.localeIdByDatePickerType);
    const firstMonthDay = startOfDay(firstMonthDate, this.intl.localeIdByDatePickerType);
    const backward = -1;
    const date = addWeeks(firstMonthDate, this.intl.firstDay(), backward, this.intl.localeIdByDatePickerType);
    const cells = range(0, CELLS_LENGTH);
    const today = getToday();
    return range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addDays(date, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this.normalize(addDays(baseDate, cellOffset), min, max);
        const cellDay = startOfDay(cellDate, this.intl.localeIdByDatePickerType);
        const otherMonth = cellDay < firstMonthDay || cellDay > lastMonthDay;

        const endDay = endOfDay(cellDate, this.intl.localeIdByDatePickerType);
        const outOfRange = (!min ? false : startOfDay(cellDate, this.intl.localeIdByDatePickerType) < min) || (!max ? false : endDay > max);
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

}
