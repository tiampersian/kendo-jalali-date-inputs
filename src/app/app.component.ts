import { ChangeDetectorRef, Component, Inject, LOCALE_ID, Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { RTL } from '@progress/kendo-angular-l10n';
import { DatePickerType, JalaliCldrIntlService } from '@progress/kendo-jalali-date-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  viewProviders: [
    { provide: RTL, useFactory: isRtl, deps: [IntlService] }
  ],

})
export class AppComponent {
  title = 'kendo-jalali-datepicker';
  public value: Date = new Date();
  rerender = true;
  locales = ['fa-IR', 'en-US'];
  calendarTypes = Object.values(DatePickerType);
  calendarType = '';
  currentLocaleId = '';
  constructor(
    @Inject(IntlService) private localeService: JalaliCldrIntlService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.calendarType = localeService.isJalali ? DatePickerType.jalali : DatePickerType.gregorian;
    this.currentLocaleId = localeService.localeId;
  }

  changeCalendarType(value) {
    localStorage.setItem('locale', value);
    this.calendarType = value;
    this.localeService.toggleType();
    this.reload();

  }
  private reload() {
    this.rerender = false;
    this.cdr.detectChanges();
    this.rerender = true;
  }

  changeLocaleId(value) {
    this.localeService.changeLocaleId(value);
    this.reload();

  }
}

export function isRtl(intlService:JalaliCldrIntlService) {
  debugger
  return intlService.localeId === 'fa-id';
}
