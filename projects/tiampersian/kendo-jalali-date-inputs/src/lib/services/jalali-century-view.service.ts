import { Inject, Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { addDecades } from '@progress/kendo-date-math';
import { JalaliCldrIntlService } from './jalali-cldr-intl.service';
import { firstDecadeOfCentury, firstYearOfDecade, getToday, isInRange, isInSelectionRange, lastDecadeOfCentury, range } from './kendo-util-overrides';
import { CenturyViewService } from '@progress/kendo-angular-dateinputs';
import { CELLS_LENGTH, EMPTY_DATA, ROWS_LENGTH } from './kendo-services/decade-view.service';

@Injectable()
export class JalaliCenturyViewService extends CenturyViewService {

  constructor(
    @Inject(IntlService) private _intlService: JalaliCldrIntlService
  ) {
    super();
  }

  title(current) {
    if (!current) {
      return '';
    }

    const temp = this._intlService.getDayJsValue(lastDecadeOfCentury(current, this._intlService.localeIdByDatePickerType)).format('YYYY');
    return `${this._intlService.getDayJsValue(firstDecadeOfCentury(current, this._intlService.localeIdByDatePickerType)).format('YYYY')} - ${temp}`;
  }

  navigationTitle(value) {
    return `${this._intlService.getDayJsValue(firstDecadeOfCentury(value, this._intlService.localeIdByDatePickerType)).format('YYYY')}`;
  }


  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDate, selectionRange = {}, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstDecadeOfCentury(viewDate, this._intlService.localeIdByDatePickerType);
    const lastDate = lastDecadeOfCentury(viewDate, this._intlService.localeIdByDatePickerType);
    const isSelectedDateInRange = isInRange(selectedDate, min, max);
    const today = getToday();
    const data = range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addDecades(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = super['normalize'](addDecades(baseDate, cellOffset), min, max);
        if (!this.isInRange(cellDate, firstDate, lastDate)) {
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
          isSelected: isActiveView && isSelectedDateInRange && this.isEqual(cellDate, selectedDate),
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

  isInRange(candidate, min, max) {
    const year = firstYearOfDecade(candidate, this._intlService.localeIdByDatePickerType).getFullYear();
    const aboveMin = !min || firstYearOfDecade(min, this._intlService.localeIdByDatePickerType).getFullYear() <= year;
    const belowMax = !max || year <= firstYearOfDecade(max, this._intlService.localeIdByDatePickerType).getFullYear();
    return aboveMin && belowMax;
  }
}
