import { shiftWeekNames } from '../kendo-util-overrides';
export class WeekNamesService {
  constructor(private intl) {
  }
  getWeekNames(includeWeekNumber = false) {
      const weekNames = shiftWeekNames(this.intl.dateFormatNames({ nameType: 'short', type: 'days' }), this.intl.firstDay());
      return includeWeekNumber ? [''].concat(weekNames) : weekNames;
  }
}


