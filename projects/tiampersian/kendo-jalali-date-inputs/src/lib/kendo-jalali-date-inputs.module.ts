import { Inject, NgModule } from '@angular/core';
import '@angular/localize/init';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/fa/all';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';
import { KendoDatePickerDirective } from './components/navigation.directive';
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
export class KendoJalaliDateInputsModule {
  constructor(
  ) {
  }
}



