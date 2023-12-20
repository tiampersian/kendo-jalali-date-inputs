import { Inject, Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import dayjs from 'dayjs';
import { JalaliCldrIntlService } from './jalali-cldr-intl.service';
import { EMPTY_SELECTIONRANGE, getToday, isInSelectionRange, range } from './kendo-util-overrides';
import { addMonths } from '@progress/kendo-date-math';
import { YearViewService, EMPTY_DATA, CELLS_LENGTH, ROWS_LENGTH } from './kendo-services/year-view.services';


@Injectable()
export class JalaliYearViewService extends YearViewService {
  constructor(
    @Inject(IntlService) protected intl: JalaliCldrIntlService
  ) {
    super(intl);
  }

  abbrMonthNames2() {
    if (this.intl.isJalali) {
      return Array.from(Array(12).keys()).map((x, i) => {
        return this.intl.getDayJsValue('' + i, 'M').format('MMMM');
      });
    }

    return this.intl.getDayJsValue().localeData().monthsShort();
  }

  override data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDate, selectionRange = EMPTY_SELECTIONRANGE, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }

    const months = this.abbrMonthNames2();
    const isSelectedDateInRange = dayjs(selectedDate).isBetween(min, max);
    //firstMonthOfYear
    const firstDate = this.intl.getDayJsValue(viewDate).startOf('year').add(this.intl.getDayJsValue(viewDate).date() - 1, 'day').toDate();
    const lastDate = this.intl.getDayJsValue(viewDate).endOf('year').add(-1, 'month').add(this.intl.getDayJsValue(viewDate).date(), 'day').toDate();
    const currentYear = this.intl.getDayJsValue(firstDate).year()
    const cells = range(0, CELLS_LENGTH);
    const today = getToday();

    const xxx = range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addMonths(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = this['normalize'](addMonths(baseDate, cellOffset), min, max);
        const changedYear = currentYear < this.intl.getDayJsValue(cellDate).year()
        if (!dayjs(cellDate).isBetween(min, max)) {
          return null;
        }
        if (changedYear) {
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
          isSelected: isActiveView && isSelectedDateInRange && this.isEqual(cellDate, selectedDate),
          isWeekend: false,
          isRangeStart,
          isRangeMid,
          isRangeEnd,
          isRangeSplitEnd: isRangeMid && this.isEqual(cellDate, lastDate),
          isRangeSplitStart: isRangeMid && this.isEqual(cellDate, firstDate),
          isToday: this.isEqual(cellDate, today),
          title: this.cellTitle(cellDate),
          value: cellDate
        };
      });
    });

    return xxx;
  }
  override title(current: any) {
    return `${this.intl.getDayJsValue(current).format('YYYY')}`
  }
  override navigationTitle(value: any) {
    return `${this.intl.getDayJsValue(value).format('YYYY')}`

  }
}
