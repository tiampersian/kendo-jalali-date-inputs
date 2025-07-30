import { EnvironmentInjector, EnvironmentProviders, Optional, Provider, SkipSelf } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { HeaderTitleTemplateFactory } from './HeaderTitleTemplateFactory';
import { JalaliCenturyViewService } from './services/jalali-century-view.service';
import { JalaliCldrIntlService } from './services/jalali-cldr-intl.service';
import { JalaliDecadeViewService } from './services/jalali-decade-view.service';
import { JalaliMonthViewService } from './services/jalali-month-view.service';
import { JalaliWeekNamesService } from './services/jalali-week-names.service';
import { JalaliYearViewService } from './services/jalali-year-view.service';
import { CenturyViewService, DecadeViewService, MonthViewService, WeekNamesService, YearViewService } from '@progress/kendo-angular-dateinputs';

export const Providers = [
  JalaliCenturyViewService,
  JalaliDecadeViewService,
  JalaliYearViewService,
  JalaliMonthViewService,
  JalaliWeekNamesService,
  { provide: IntlService,useClass:JalaliCldrIntlService, },// ...getDeps(JalaliCldrIntlService)
  { provide: CldrIntlService,useClass:JalaliCldrIntlService, },// ...getDeps(JalaliCldrIntlService)
  { provide: CenturyViewService,useClass:JalaliCenturyViewService, },// ...getDeps(JalaliCenturyViewService)
  { provide: DecadeViewService,useClass:JalaliDecadeViewService, },// ...getDeps(JalaliDecadeViewService)
  { provide: YearViewService,useClass:JalaliYearViewService, },// ...getDeps(JalaliYearViewService)
  { provide: WeekNamesService,useClass:JalaliWeekNamesService, },// ...getDeps(JalaliWeekNamesService)
  { provide: MonthViewService,useClass:JalaliMonthViewService, },// ...getDeps(JalaliMonthViewService)
  { provide: 'HeaderTitleTemplate', useFactory: HeaderTitleTemplateFactory, deps: [EnvironmentInjector] },
] as Array<Provider>;

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

function getDeps(srv) {
  return { useFactory: useExistingIfExist, deps: [[new Optional(), new SkipSelf(), srv], srv] } as any;
}

function useExistingIfExist(oldService, newService) {
  if (oldService) return oldService;

  return newService;
}