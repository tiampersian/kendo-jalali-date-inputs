import { ModuleWithProviders, NgModule } from '@angular/core';
import '@angular/localize/init';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/fa/all';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';
import { KendoDatePickerDirective } from './components/navigation.directive';
import { IConfig } from './models/config.model';
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
    NumberPipe,
    { provide: 'CONFIGS', useValue: {} }
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

  static forRoot(configs?: IConfig): ModuleWithProviders<KendoJalaliDateInputsModule> {
    return {
      ngModule: KendoJalaliDateInputsModule,
      providers: [
        { provide: 'CONFIGS', useValue: configs || {} }
      ]
    }
  };
}



