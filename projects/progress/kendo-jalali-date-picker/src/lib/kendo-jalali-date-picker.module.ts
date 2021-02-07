import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlModule, IntlService } from '@progress/kendo-angular-intl';
import { CenturyViewService, DateInputsModule, DecadeViewService, MonthViewService, WeekNamesService, YearViewService } from '@progress/kendo-angular-dateinputs';
import { JalaliCenturyViewService } from './services/century-view.service';
import { JalaliDecadeViewService } from './services/decade-view.service';
import { JalaliMonthViewService } from './services/month-view.service';
import { JalaliYearViewService } from './services/year-view.services';
import { JalaliCldrIntlService } from './services/locale.service';
import { JalaliWeekNamesService } from './services/week-names.service';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IntlModule,
    DateInputsModule
  ],
  providers: [
    { provide: CenturyViewService, useClass: JalaliCenturyViewService },
    { provide: DecadeViewService, useClass: JalaliDecadeViewService },
    { provide: YearViewService, useClass: JalaliYearViewService },
    { provide: MonthViewService, useClass: JalaliMonthViewService },
    { provide: WeekNamesService, useClass: JalaliWeekNamesService },

    { provide: IntlService, useClass: JalaliCldrIntlService }
  ],
  exports: [
    DateInputsModule
  ]
})
export class KendoJalaliDatePickerModule { }
