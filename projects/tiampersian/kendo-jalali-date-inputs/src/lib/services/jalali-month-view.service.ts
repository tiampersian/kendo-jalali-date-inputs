import { Inject, Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { addDays, addMonths, dayOfWeek, getDate } from '@progress/kendo-date-math';
import dayjs from 'dayjs';
import { firstDayOfMonth, getToday, isInSelectionRange, range, lastDayOfMonth } from './utils';
import { JalaliCldrIntlService } from './locale.service';
import { MonthViewService, CELLS_LENGTH, EMPTY_DATA, ROWS_LENGTH } from './month-view.service';


@Injectable()
export class JalaliMonthViewService extends MonthViewService {
  constructor(
    @Inject(IntlService) protected intlService: JalaliCldrIntlService
  ) {
    super(intlService);
  }

  value(current) {
    if (!current) {
      return '';
    }
    const res = dayjs(current).calendar(this.intlService.calendarType).locale(this.intlService.localeId).format('DD').toString();
    return res;
  }

  abbrMonthNames2() {
    if (this.intlService.isJalali) {
      return Array.from(Array(12).keys()).map((x, i) => {
        return dayjs('' + i, 'M').calendar(this.intlService.calendarType).locale(this.intlService.localeId).format('MMMM');
      });
    }
    return dayjs().calendar(this.intlService.calendarType).locale(this.intlService.localeId).localeData().monthsShort();
  }

  navigationTitle(value) {
    if (!value) {
      return '';
    }

    if (this.isRangeStart(value)) {
      return dayjs(value).calendar(this.intlService.calendarType).locale(this.intlService.localeId).format('YYYY');
    }

    return this.abbrMonthNames2()[dayjs(value).calendar(this.intlService.calendarType).locale(this.intlService.localeId).month()];
  }

  isRangeStart(value) {
    if (!value) { return false; }
    return dayjs(value).calendar(this.intlService.calendarType).locale(this.intlService.localeId).month() === 0;
  }

  title(current) {
    return `${this.abbrMonthNames2()[dayjs(current).calendar(this.intlService.calendarType).locale(this.intlService.localeId).month()]} ${dayjs(current).calendar(this.intlService.calendarType).locale(this.intlService.localeId).format('YYYY')}`;
  }

  skip(value, min) {
    const diff = dayjs(value).calendar(this.intlService.calendarType).locale(this.intlService.localeId).endOf('month').diff(
      dayjs(min).calendar(this.intlService.calendarType).locale(this.intlService.localeId).startOf('month'), 'month'
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
    return dayjs(date).calendar(this.intlService.calendarType).locale(this.intlService.localeId).startOf('month').toDate();
  }
  datesList(start, count) {
    return range(0, count).map(i => addMonths(start, i));
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDate, selectionRange = [], viewDate, isDateDisabled = () => false } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const xx = dayjs(viewDate).calendar(this.intlService.calendarType).locale(this.intlService.localeId).toDate();
    const firstMonthDate = firstDayOfMonth(xx, this.intlService.localeIdByDatePickerType);
    const firstMonthDay = getDate(firstMonthDate);
    const lastMonthDate = lastDayOfMonth(xx, this.intlService.localeIdByDatePickerType);
    const lastMonthDay = getDate(lastMonthDate);
    const backward = -1;
    const isSelectedDateInRange = dayjs(selectedDate).isBetween(min, max);
    const date = dayOfWeek(firstMonthDate, this.intlService.firstDay(), backward);
    const cells = range(0, CELLS_LENGTH);
    console.log('console',this.intlService.firstDay())
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
