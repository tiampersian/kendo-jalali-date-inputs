import { ComponentFactoryResolver, Injector } from '@angular/core';
import { CenturyViewService, DecadeViewService, MonthViewService, WeekNamesService, YearViewService } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { HeaderTitleTemplateFactory } from './HeaderTitleTemplateFactory';
import { JalaliCenturyViewService } from './services/century-view.service';
import { JalaliDecadeViewService } from './services/decade-view.service';
import { JalaliCldrIntlService } from './services/locale.service';
import { JalaliMonthViewService } from './services/month-view.service';
import { JalaliWeekNamesService } from './services/week-names.service';
import { JalaliYearViewService } from './services/year-view.services';

export const Providers = [
  { provide: CenturyViewService, useClass: JalaliCenturyViewService },
  { provide: DecadeViewService, useClass: JalaliDecadeViewService },
  { provide: YearViewService, useClass: JalaliYearViewService },
  { provide: MonthViewService, useClass: JalaliMonthViewService },
  { provide: WeekNamesService, useClass: JalaliWeekNamesService },
  { provide: IntlService, useClass: JalaliCldrIntlService },
  { provide: 'HeaderTitleTemplate', useFactory: HeaderTitleTemplateFactory, deps: [Injector, ComponentFactoryResolver] },
];
