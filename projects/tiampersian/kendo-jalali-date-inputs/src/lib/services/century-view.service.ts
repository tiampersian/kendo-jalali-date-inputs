import { addDecades } from '@progress/kendo-date-math';
import { CenturyViewService, DateInputComponent } from '@progress/kendo-angular-dateinputs';
import moment from 'jalali-moment';
import { firstDecadeOfCentury, firstYearOfDecade, getToday, isInRange, isInSelectionRange, lastDecadeOfCentury, range } from './utils';
import { Inject, Injectable } from '@angular/core';
const EMPTY_DATA = [[]];
const CELLS_LENGTH = 4;
const ROWS_LENGTH = 2;
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { JalaliCldrIntlService } from './locale.service';

@Injectable()
export class JalaliCenturyViewService extends CenturyViewService {

  constructor(
    @Inject(IntlService) private intlService: JalaliCldrIntlService
  ) {
    super();
  }

  title(current) {
    if (!current) {
      return '';
    }

    const temp = moment(lastDecadeOfCentury(current, this.intlService.localeIdByDatePickerType)).locale(this.intlService.localeIdByDatePickerType).format('YYYY');
    return `${moment(firstDecadeOfCentury(current, this.intlService.localeIdByDatePickerType)).locale(this.intlService.localeIdByDatePickerType).format('YYYY')} - ${temp}`;
  }
  navigationTitle(value) {
    return `${moment(firstDecadeOfCentury(value, this.intlService.localeIdByDatePickerType)).locale(this.intlService.localeIdByDatePickerType).format('YYYY')}`;
  }


  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDate, selectionRange = {}, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstDecadeOfCentury(viewDate, this.intlService.localeIdByDatePickerType);
    const lastDate = lastDecadeOfCentury(viewDate, this.intlService.localeIdByDatePickerType);
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
        const title = moment(cellDate).locale(this.intlService.localeIdByDatePickerType).format('YYYY');

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
    const year = firstYearOfDecade(candidate, this.intlService.localeIdByDatePickerType).getFullYear();
    const aboveMin = !min || firstYearOfDecade(min, this.intlService.localeIdByDatePickerType).getFullYear() <= year;
    const belowMax = !max || year <= firstYearOfDecade(max, this.intlService.localeIdByDatePickerType).getFullYear();
    return aboveMin && belowMax;
  }
}
