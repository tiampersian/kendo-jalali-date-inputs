import { NgModule, Injector, ComponentFactoryResolver, Inject } from '@angular/core';
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


@NgModule({
  declarations: [
    KendoJalaliHeaderTitleTemplateComponent
  ],
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

    { provide: IntlService, useClass: JalaliCldrIntlService },
    { provide: 'HeaderTitleTemplate', useValue: KendoJalaliHeaderTitleTemplateComponent }
  ],
  exports: [
    DateInputsModule
  ]
})
export class KendoJalaliDatePickerModule {
  constructor(
    injector: Injector,
    resolver: ComponentFactoryResolver,
    @Inject(IntlService) intlService: JalaliCldrIntlService
  ) {
    this.setHeaderTitleTemplate(injector, resolver, intlService);
  }

  private setHeaderTitleTemplate(injector: Injector, resolver: ComponentFactoryResolver, intlService: JalaliCldrIntlService): void {
    const HeaderTitleTemplate = injector.get<string>('HeaderTitleTemplate' as any);
    const temp = resolver.resolveComponentFactory(HeaderTitleTemplate as any).create(injector);
    temp.changeDetectorRef.detectChanges();
    intlService.setTitleTemplate((temp.instance as KendoJalaliHeaderTitleTemplateComponent));
  }
}
