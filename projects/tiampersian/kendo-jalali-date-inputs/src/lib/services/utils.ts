import { getDate } from '@progress/kendo-date-math';
import moment from 'dayjs';

export const range = (start, end, step = 1) => {
  const result = [];
  for (let i = start; i < end; i = i + step) {
    result.push(i);
  }
  return result;
};
export const EMPTY_SELECTIONRANGE = { start: null, end: null };

export const getToday = () => getDate(new Date());
export const isInSelectionRange = (value, selectionRange) => {
  const { start, end } = selectionRange || EMPTY_SELECTIONRANGE;
  if (!start || !end) {
    return false;
  }
  return start < value && value < end;
};
export const isInRange = (dt, min, max) => {
  return moment(dt).isBetween(min, max);
}
export const firstYearOfDecade = (dt, localeId?) => {
  const year = moment(dt).calendar(getCalendarType(localeId)).year();
  return moment(dt).calendar(getCalendarType(localeId)).add(-(year % 10), 'year').toDate();
}
export const lastYearOfDecade = (dt, localeId?) => {
  const year = moment(dt).calendar(getCalendarType(localeId)).year();
  return moment(dt).calendar(getCalendarType(localeId)).add((9 - (year % 10)), 'year').toDate();
}
export const firstDayOfMonth = (dt, localeId?) => {
  return moment(dt).calendar(getCalendarType(localeId)).startOf('month').toDate();
}
export const lastDayOfMonth = (dt, localeId?) => {
  return moment(dt).calendar(getCalendarType(localeId)).endOf('month').toDate();
}
// export const addMonths2 = (date, offset) => {
//   var newDate = moment(date).toDate();
//   var diff = (newDate.getMonth() + offset) % 12;
//   var expectedMonth = (12 + diff) % 12;
//   newDate.setMonth(newDate.getMonth() + offset);
//   return normalize(adjust_dst_1.adjustDST(newDate, date.getHours()), expectedMonth);
// };
export const getCalendarType = (localeId: string) => {
  return (localeId === 'fa' || localeId === 'fa-IR') ? 'jalali' : 'gregory';
}
export const firstDecadeOfCentury = (dt, localeId?) => {
  const x = moment(dt).calendar(getCalendarType(localeId)).year();
  return moment(dt).calendar(getCalendarType(localeId)).add((-(x % 100)), 'year').toDate();
}
export const lastDecadeOfCentury = (dt, localeId?) => {
  const x = moment(dt).calendar(getCalendarType(localeId)).year();
  return moment(dt).calendar(getCalendarType(localeId)).add((-(x % 100)) + 90, 'year').toDate();

}

export const shiftWeekNames = (names, offset) => (names.slice(offset).concat(names.slice(0, offset)));

export var Action;
(function (Action) {
  Action[Action["Left"] = 0] = "Left";
  Action[Action["Right"] = 1] = "Right";
  Action[Action["Up"] = 2] = "Up";
  Action[Action["Down"] = 3] = "Down";
  Action[Action["PrevView"] = 4] = "PrevView";
  Action[Action["NextView"] = 5] = "NextView";
  Action[Action["FirstInView"] = 6] = "FirstInView";
  Action[Action["LastInView"] = 7] = "LastInView";
  Action[Action["LowerView"] = 8] = "LowerView";
  Action[Action["UpperView"] = 9] = "UpperView";
})(Action || (Action = {}));
export const isPresent = (value) => value !== undefined && value !== null;
