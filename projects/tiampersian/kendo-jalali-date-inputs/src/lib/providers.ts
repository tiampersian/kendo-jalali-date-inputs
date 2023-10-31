import { ComponentFactoryResolver, Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { HeaderTitleTemplateFactory } from './HeaderTitleTemplateFactory';
import { JalaliCenturyViewService } from './services/century-view.service';
import { JalaliDecadeViewService } from './services/decade-view.service';
import { JalaliCldrIntlService } from './services/locale.service';
import { JalaliMonthViewService } from './services/jalali-month-view.service';
import { JalaliWeekNamesService } from './services/week-names.service';
import { JalaliYearViewService } from './services/year-view.services';

export const Providers = [
  JalaliCenturyViewService,
  JalaliDecadeViewService,
  JalaliYearViewService,
  JalaliMonthViewService,
  JalaliWeekNamesService,
  { provide: IntlService, useClass: JalaliCldrIntlService },
  { provide: 'HeaderTitleTemplate', useFactory: HeaderTitleTemplateFactory, deps: [Injector, ComponentFactoryResolver] },
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
