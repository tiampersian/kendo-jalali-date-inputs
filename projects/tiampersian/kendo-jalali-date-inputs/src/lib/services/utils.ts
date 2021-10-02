import { getDate } from '@progress/kendo-date-math';
import moment from 'jalali-moment';

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
export const firstYearOfDecade = (dt, localeId) => {
  const year = moment(dt).locale(localeId).year();
  return moment(dt).locale(localeId).add(-(year % 10), 'year').toDate();
}
export const lastYearOfDecade = (dt, localeId) => {
  const year = moment(dt).locale(localeId).year();
  return moment(dt).locale(localeId).add((9 - (year % 10)), 'year').toDate();
}
export const firstDayOfMonth = (dt, localeId) => {
  return moment(dt).locale(localeId).startOf('month').toDate();
}
export const lastDayOfMonth = (dt, localeId) => {
  return moment(dt).locale(localeId).endOf('month').toDate();
}
// export const addMonths2 = (date, offset) => {
//   var newDate = moment(date).toDate();
//   var diff = (newDate.getMonth() + offset) % 12;
//   var expectedMonth = (12 + diff) % 12;
//   newDate.setMonth(newDate.getMonth() + offset);
//   return normalize(adjust_dst_1.adjustDST(newDate, date.getHours()), expectedMonth);
// };
export const firstDecadeOfCentury = (dt, localeId) => {
  const x = moment(dt).locale(localeId).year();
  return moment(dt).locale(localeId).add((-(x % 100)) , 'year').toDate();
}
export const lastDecadeOfCentury = (dt, localeId) => {
  const x = moment(dt).locale(localeId).year();
  return moment(dt).locale(localeId).add((-(x % 100)) + 90, 'year').toDate();

}


