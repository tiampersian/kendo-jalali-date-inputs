import { ChangeDetectorRef, Directive, Inject, Self, SkipSelf } from '@angular/core';
import { NavigationComponent } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { Providers } from '../providers';
import { JalaliCldrIntlService } from '../services/jalali-cldr-intl.service';
import { debounceTime } from 'rxjs/operators';

// tslint:disable-next-line:no-string-literal
NavigationComponent.prototype['intlChange'] = function(): void {
  this.cdr.markForCheck();
};

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'kendo-datepicker,kendo-datetimepicker,kendo-calendar,kendo-timepicker,kendo-multiviewcalendar', // ,kendo-dateinput
  providers: [
    ...Providers
  ]
})
export class KendoDatePickerDirective {
  constructor(
    @Inject(IntlService) @Self() intl: JalaliCldrIntlService,
    @Inject(IntlService) @SkipSelf() hostIntlService: JalaliCldrIntlService,
    @Inject('HeaderTitleTemplate') headerTitleTemplate,
    private cdr: ChangeDetectorRef
  ) {
    hostIntlService.changes.pipe(debounceTime(30)).subscribe(x => {
      intl.changeLocaleId(hostIntlService.localeId);
      intl.changeType(hostIntlService.datePickerType);
      this.cdr.detectChanges();
    });
  }
}
