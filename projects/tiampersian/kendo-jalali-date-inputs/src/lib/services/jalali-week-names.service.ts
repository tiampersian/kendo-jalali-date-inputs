import { Injectable } from "@angular/core";
import { IntlService } from "@progress/kendo-angular-intl";
import { WeekNamesService } from './kendo-services/week-names.service';


@Injectable()
export class JalaliWeekNamesService extends WeekNamesService {
  constructor(intl: IntlService) {
    super(intl);
  }


  getWeekNames(includeWeekNumber?: boolean): string[] {
    return super.getWeekNames(includeWeekNumber);
  }
}
