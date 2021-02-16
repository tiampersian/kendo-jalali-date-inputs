import { NgModule, Injector, ComponentFactoryResolver, Inject, Optional, Host, LOCALE_ID, forwardRef } from '@angular/core';
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
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';
import '@angular/localize/init';
import { KendoDatePickerDirective } from './components/navigation.component';
import { HeaderTitleTemplateFactory } from './HeaderTitleTemplateFactory';
import { Providers } from './providers';

@NgModule({
  declarations: [
    KendoJalaliHeaderTitleTemplateComponent,
    KendoDatePickerDirective
  ],
  imports: [
    IntlModule,
    DateInputsModule
  ],
  providers: [
    ...Providers
  ],
  exports: [
    DateInputsModule,
    KendoDatePickerDirective,
  ]
})
export class KendoJalaliDatePickerModule {
  constructor(
    @Inject('HeaderTitleTemplate') headerTitleTemplate
  ) {
    // const temp = resolver.resolveComponentFactory(KendoJalaliHeaderTitleTemplateComponent as any).create(injector);
    // temp.changeDetectorRef.detectChanges();
    // // template = temp.instance;
  }
}



