import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlModule } from '@progress/kendo-angular-intl';
import { CenturyViewService, DateInputsModule, DecadeViewService, MonthViewService, WeekNamesService, YearViewService } from '@progress/kendo-angular-dateinputs';
import { JalaliCenturyViewService } from './services/century-view.service';
import { JalaliDecadeViewService } from './services/decade-view.service';
import { JalaliMonthViewService } from './services/month-view.service';
import { JalaliYearViewService } from './services/year-view.services';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IntlModule,
    DateInputsModule
  ],
  providers: [
    { provide: YearViewService, useClass: JalaliYearViewService },
    { provide: MonthViewService, useClass: JalaliMonthViewService },
    { provide: DecadeViewService, useClass: JalaliDecadeViewService },
    { provide: CenturyViewService, useClass: JalaliCenturyViewService },
  ],
  exports: [
    IntlModule,
    DateInputsModule
  ]
})
export class KendoJalaliDatePickerModule { }
