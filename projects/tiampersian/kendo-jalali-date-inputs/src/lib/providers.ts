import { Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { HeaderTitleTemplateFactory } from './HeaderTitleTemplateFactory';
import { JalaliCenturyViewService } from './services/jalali-century-view.service';
import { JalaliCldrIntlService } from './services/jalali-cldr-intl.service';
import { JalaliDecadeViewService } from './services/jalali-decade-view.service';
import { JalaliMonthViewService } from './services/jalali-month-view.service';
import { JalaliWeekNamesService } from './services/jalali-week-names.service';
import { JalaliYearViewService } from './services/jalali-year-view.service';

export const Providers = [
  // DateRangeService,
  JalaliCenturyViewService,
  JalaliDecadeViewService,
  JalaliYearViewService,
  JalaliMonthViewService,
  JalaliWeekNamesService,
  JalaliCldrIntlService,
  { provide: IntlService, useExisting: JalaliCldrIntlService },
  { provide: 'HeaderTitleTemplate', useFactory: HeaderTitleTemplateFactory, deps: [Injector] },
];
var CalendarViewEnum;
(function (CalendarViewEnum) {
    CalendarViewEnum[CalendarViewEnum["month"] = 0] = "month";
    CalendarViewEnum[CalendarViewEnum["year"] = 1] = "year";
    CalendarViewEnum[CalendarViewEnum["decade"] = 2] = "decade";
    CalendarViewEnum[CalendarViewEnum["century"] = 3] = "century";
})(CalendarViewEnum || (CalendarViewEnum = {}));

export const services = {
  [CalendarViewEnum.month]: JalaliMonthViewService,
  [CalendarViewEnum.year]: JalaliYearViewService,
  [CalendarViewEnum.decade]: JalaliDecadeViewService,
  [CalendarViewEnum.century]: JalaliCenturyViewService
};
