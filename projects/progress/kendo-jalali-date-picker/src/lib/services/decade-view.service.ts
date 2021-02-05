import { DecadeViewService } from '@progress/kendo-angular-dateinputs';
import { addYears } from '@progress/kendo-date-math';
import moment from 'jalali-moment';
import { firstYearOfDecade, getToday, isInRange, isInSelectionRange, lastYearOfDecade, range } from './utils';
const EMPTY_DATA = [[]];
const CELLS_LENGTH = 5;
const ROWS_LENGTH = 2;

export class JalaliDecadeViewService extends DecadeViewService {
  constructor() {
    super()
  }

  title(value) {
    if (!value) {
      return '';
    }
    return `${moment(firstYearOfDecade(value)).locale('fa').format('YYYY')} - ${moment(lastYearOfDecade(value)).locale('fa').format('YYYY')}`;
  }
  navigationTitle(value) {
    if (!value) {
      return '';
    }
    return `${moment(firstYearOfDecade(value)).locale('fa').format('YYYY')}`;

  }
  data(options) {
    const { cellUID, focusedDate, isActiveView, max, min, selectedDate, selectionRange = {}, viewDate } = options;
    if (!viewDate) {
      return EMPTY_DATA;
    }
    const cells = range(0, CELLS_LENGTH);
    const firstDate = firstYearOfDecade(viewDate);
    const lastDate = lastYearOfDecade(viewDate);
    const isSelectedDateInRange = isInRange(selectedDate, min, max);
    const today = getToday();
    const data = range(0, ROWS_LENGTH).map(rowOffset => {
      const baseDate = addYears(firstDate, rowOffset * CELLS_LENGTH);
      return cells.map(cellOffset => {
        const cellDate = super['normalize'](addYears(baseDate, cellOffset), min, max);
        if (!this.isInRange(cellDate, min, max)) {
          return null;
        }
        const isRangeStart = this.isEqual(cellDate, selectionRange.start);
        const isRangeEnd = this.isEqual(cellDate, selectionRange.end);
        const isInMiddle = !isRangeStart && !isRangeEnd;
        const isRangeMid = isInMiddle && isInSelectionRange(cellDate, selectionRange);
        const title = moment(cellDate).locale('fa').format('YYYY');
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
}
