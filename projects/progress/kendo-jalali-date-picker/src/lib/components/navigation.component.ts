import { Directive, Inject } from '@angular/core';
import { NavigationComponent } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { Providers } from '../providers';
import { JalaliCldrIntlService } from '../services/locale.service';

// tslint:disable-next-line:no-string-literal
NavigationComponent.prototype['intlChange'] = function(): void {
  this.cdr.markForCheck();
};

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'kendo-datepicker,kendo-dateinput,kendo-datetimepicker',// ,kendo-calendar,kendo-timepicker
  providers: [
    ...Providers
  ]
})
export class KendoDatePickerDirective {
  constructor(
    @Inject(IntlService) intlService: JalaliCldrIntlService,
    @Inject('HeaderTitleTemplate') headerTitleTemplate
  ) {
  }
}
