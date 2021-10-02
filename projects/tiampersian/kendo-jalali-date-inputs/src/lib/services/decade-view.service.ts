import { Inject, Injectable } from '@angular/core';
import { DecadeViewService } from '@progress/kendo-angular-dateinputs';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { addYears } from '@progress/kendo-date-math';
import moment from 'jalali-moment';
import { JalaliCldrIntlService } from './locale.service';
import { EMPTY_SELECTIONRANGE, firstYearOfDecade, getToday, isInRange, isInSelectionRange, lastYearOfDecade, range } from './utils';
const EMPTY_DATA = [[]];
const CELLS_LENGTH = 4;
const ROWS_LENGTH = 3;

@Injectable()
export class JalaliDecadeViewService extends DecadeViewService {
  constructor(
    @Inject(IntlService) private intlService: JalaliCldrIntlService
  ) {
    super();
  }


  title(value) {
    if (!value) {
      return '';
    }
    const firstYear = moment(firstYearOfDecade(value, this.intlService.localeIdByDatePickerType)).locale(this.intlService.localeIdByDatePickerType).format('YYYY');
    const lastYear = moment(lastYearOfDecade(value, this.intlService.localeIdByDatePickerType)).locale(this.intlService.localeIdByDatePickerType).format('YYYY');
    if (this.intlService.isLocaleIran) {
      return `${lastYear} - ${firstYear}`;
    }
    return `${firstYear} - ${lastYear}`;
  }

  navigationTitle(value) {
    if (!value) {
      return '';
    }
    return `${moment(firstYearOfDecade(value, this.intlService.localeIdByDatePickerType)).locale(this.intlService.localeIdByDatePickerType).format('YYYY')}`;
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstYearOfDecade(viewDate, this.intlService.localeIdByDatePickerType);
    const lastDate = lastYearOfDecade(viewDate, this.intlService.localeIdByDatePickerType);
    const today = getToday();
    // isInRange(selectedDate, min, max)
    const data = range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addYears(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = super['normalize'](addYears(baseDate, cellOffset), min, max);
        const nextDecade = cellDate.getFullYear() > lastDate.getFullYear();

        if (!this.isInRange(cellDate, min, max) || nextDecade) {
          return null;
        }
        const isRangeStart = this.isEqual(cellDate, selectionRange.start);
        const isRangeEnd = this.isEqual(cellDate, selectionRange.end);
        const isInMiddle = !isRangeStart && !isRangeEnd;
        const isRangeMid = isInMiddle && isInSelectionRange(cellDate, selectionRange);
        const title = moment(cellDate).locale(this.intlService.localeIdByDatePickerType).format('YYYY');
        return {
          formattedValue: title,
          id: `${cellUID}${cellDate.getTime()}`,
          isFocused: this.isEqual(cellDate, focusedDate),
          isSelected: isActiveView && selectedDates.some(date => this.isEqual(cellDate, date)),
          isWeekend: false,
          isRangeStart,
          isRangeMid,
          isRangeEnd,
          isRangeSplitEnd: isRangeMid && this.isEqual(cellDate, lastDate),
          isRangeSplitStart: isRangeMid && this.isEqual(cellDate, firstDate),
          isToday: this.isEqual(cellDate, today),
          title,
          value: cellDate
        };
      });
    });
    return data;
  }
}
