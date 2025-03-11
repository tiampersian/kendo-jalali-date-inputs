import { Inject, Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { addYears } from '@progress/kendo-date-math';
import dayjs from 'dayjs';
import { JalaliCldrIntlService } from './jalali-cldr-intl.service';
import { EMPTY_SELECTIONRANGE, firstYearOfDecade, getToday, isInSelectionRange, lastYearOfDecade, range } from './kendo-util-overrides';
import { EMPTY_DATA, CELLS_LENGTH, ROWS_LENGTH } from './kendo-services/decade-view.service';
import { DecadeViewService } from '@progress/kendo-angular-dateinputs';

@Injectable()
export class JalaliDecadeViewService extends DecadeViewService {
  constructor(
    @Inject(IntlService) private _intlService: JalaliCldrIntlService
  ) {
    super();
  }


  title(value) {
    if (!value) {
      return '';
    }
    
    const firstYear = this._intlService.getDayJsValue(firstYearOfDecade(value, this._intlService.localeIdByDatePickerType)).format('YYYY');
    const lastYear = this._intlService.getDayJsValue(lastYearOfDecade(value, this._intlService.localeIdByDatePickerType)).format('YYYY');
    if (this._intlService.isLocaleIran) {
      return `${lastYear} - ${firstYear}`;
    }
    return `${firstYear} - ${lastYear}`;
  }

  navigationTitle(value) {
    if (!value) {
      return '';
    }
    return `${this._intlService.getDayJsValue(firstYearOfDecade(value, this._intlService.localeIdByDatePickerType)).format('YYYY')}`;
  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDates, selectionRange = EMPTY_SELECTIONRANGE, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstYearOfDecade(viewDate, this._intlService.localeIdByDatePickerType);
    const lastDate = lastYearOfDecade(viewDate, this._intlService.localeIdByDatePickerType);
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
        const title = this._intlService.getDayJsValue(cellDate).format('YYYY');
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
