import { Inject, NgModule } from '@angular/core';
import '@angular/localize/init';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/fa/all';
import moment from 'jalali-moment';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';
import { KendoDatePickerDirective } from './components/navigation.directive';
import { NumberPipe } from './pipes/number.pipe';
import { Providers } from './providers';
import { MomentNumberService } from './services/moment-numbers';


@NgModule({
  declarations: [
    KendoJalaliHeaderTitleTemplateComponent,
    KendoDatePickerDirective,
    NumberPipe
  ],
  imports: [
    IntlModule,
    DateInputsModule
  ],
  providers: [
    ...Providers,
    MomentNumberService,
    NumberPipe
  ],
  exports: [
    DateInputsModule,
    KendoDatePickerDirective,
    NumberPipe,
  ]
})
export class KendoJalaliDateInputsModule {
  constructor(
  ) {
  }
}



