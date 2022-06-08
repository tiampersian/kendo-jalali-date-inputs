import { Injectable } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { shiftWeekNames } from './utils';
export class WeekNamesService {
  constructor(private intl) {
  }
  getWeekNames(includeWeekNumber = false) {
      const weekNames = shiftWeekNames(this.intl.dateFormatNames({ nameType: 'short', type: 'days' }), this.intl.firstDay());
      return includeWeekNumber ? [''].concat(weekNames) : weekNames;
  }
}

@Injectable()
export class JalaliWeekNamesService extends WeekNamesService {
  constructor(protected intlService: IntlService) {
    super(intlService);
  }


  getWeekNames(includeWeekNumber?: boolean): string[] {
    return super.getWeekNames(includeWeekNumber);
  }
}
