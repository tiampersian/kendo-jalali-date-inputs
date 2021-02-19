import { Injectable } from '@angular/core';
import { WeekNamesService } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';

@Injectable()
export class JalaliWeekNamesService extends WeekNamesService {
  constructor(protected intlService: IntlService) {
    super(intlService);
  }


  getWeekNames(includeWeekNumber?: boolean): string[] {
    return super.getWeekNames(includeWeekNumber);
  }
}
