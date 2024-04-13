import { getDate } from '@progress/kendo-date-math';
import dayjs from 'dayjs';

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
}

export const isInRange = (dt, min, max) => {
  return dayjs(dt).isBetween(min, max);
}

export const firstYearOfDecade = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).add(-(getYear(dt, localeId) % 10), 'year').toDate();
}

export const lastYearOfDecade = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).add((9 - (getYear(dt, localeId) % 10)), 'year').toDate();
}

export const firstDayOfMonth = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).startOf('month').toDate();
}

export const lastDayOfMonth = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).endOf('month').toDate();
}

export const endOfDay = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).endOf('day').toDate();// .add(getDayJsValue(dt, localeId).date() - 1, 'day')
}
export const startOfDay = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).startOf('day').toDate();// .add(getDayJsValue(dt, localeId).date() - 1, 'day')
}
export const firstMonthOfYear = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).startOf('year').toDate();// .add(getDayJsValue(dt, localeId).date() - 1, 'day')
}
export const lastMonthOfYear = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).endOf('year').toDate();// .add(-1, 'day').add(getDayJsValue(dt, localeId).date(), 'day')
}
export const addDays = (dt, value, localeId?) => {
  return getDayJsValue(dt, localeId).add(value, 'days').toDate();
}
export const addWeeks = (dt, value, direction, localeId?) => {
  return getDayJsValue(dt, localeId).add(value * direction, 'days').toDate();
}
export const addMonths = (dt, value, localeId?) => {
  return getDayJsValue(dt, localeId).add(value, 'month').toDate();
}
export const addYears = (dt, value, localeId?) => {
  return getDayJsValue(dt, localeId).add(value, 'year').toDate();
}
export const addDecades = (dt, value, localeId?) => {
  return getDayJsValue(dt, localeId).add(value * 100, 'year').toDate();
}

const getCalendarType = (localeId: string) => {
  return (localeId === 'fa' || localeId === 'fa-IR') ? 'jalali' : 'gregory';
}
export const getDayJsValue = (dt: any, localeId: string) => {
  return dayjs(dt).calendar(getCalendarType(localeId))
}

export const firstDecadeOfCentury = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).add((-(getYear(dt, localeId) % 100)), 'year').toDate();
}

export const lastDecadeOfCentury = (dt, localeId?) => {
  return getDayJsValue(dt, localeId).add((-(getYear(dt, localeId) % 100)) + 90, 'year').toDate();

}
export const dateInRange = (candidate, min, max) => {
  if (!candidate) {
      return candidate;
  }
  if (min && candidate < min) {
      return new Date(min);
  }
  if (max && candidate > max) {
      return new Date(max);
  }
  return candidate;
};

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

function getYear(dt: any, localeId: any) {
  return getDayJsValue(dt, localeId).year();
}

