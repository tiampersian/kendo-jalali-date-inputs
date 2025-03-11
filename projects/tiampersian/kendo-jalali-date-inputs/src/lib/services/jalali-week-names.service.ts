import { Injectable } from "@angular/core";
import { WeekDaysFormat, WeekNamesService } from "@progress/kendo-angular-dateinputs";
import { IntlService } from "@progress/kendo-angular-intl";


@Injectable()
export class JalaliWeekNamesService extends WeekNamesService {
  constructor(protected _intlService: IntlService) {
    super(_intlService);
  }

  getWeekNames(includeWeekNumber: boolean, nameType: WeekDaysFormat | 'wide'): string[] {
    return super.getWeekNames(includeWeekNumber, nameType);
  }
}
