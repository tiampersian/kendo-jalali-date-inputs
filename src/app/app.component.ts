import { ChangeDetectorRef, Component, Inject, LOCALE_ID, Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DatePickerType, JalaliCldrIntlService } from '@progress/kendo-jalali-date-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  viewProviders: [
  ],

})
export class AppComponent {
  title = 'kendo-jalali-datepicker';
  public value: Date = new Date();
  rerender = true;
  locales = Object.values(DatePickerType);
  locale = '';
  constructor(
    private localeService: IntlService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.locale = (localeService as JalaliCldrIntlService).isJalali ? DatePickerType.jalali : DatePickerType.gregorian;
  }

  changeLocale(value) {
    localStorage.setItem('locale', value);
    this.locale = value;
    (this.localeService as JalaliCldrIntlService).toggleType();

    this.cdr.detectChanges();

  }
}
