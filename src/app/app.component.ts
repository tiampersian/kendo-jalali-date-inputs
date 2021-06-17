import { RTL } from '@progress/kendo-angular-l10n';
import { ChangeDetectorRef, Component, Inject, LOCALE_ID, Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DatePickerType, JalaliCldrIntlService } from '@tiampersian/kendo-jalali-date-inputs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
  ],

})
export class AppComponent {
  title = 'kendo-jalali-date-inputs';
  public value: Date = new Date('2020-11-01T20:30:00.000Z');
  rerender = true;
  locales = ['fa-IR', 'fa', 'en-US', 'en'];
  calendarTypes = Object.values(DatePickerType);
  calendarType = '';
  currentLocaleId = '';
  constructor(
    @Inject(IntlService) private localeService: JalaliCldrIntlService,
    private cdr: ChangeDetectorRef
  ) {
    this.calendarType = localeService.isJalali ? DatePickerType.jalali : DatePickerType.gregorian;
    this.currentLocaleId = localeService.localeId;
  }

  changeCalendarType(value): void {
    localStorage.setItem('locale', value);
    this.calendarType = value;
    this.localeService.toggleType();
    this.localeService.reload();
    // this.reload();

  }
  private reload(): void {
    // this.rerender = false;
    this.cdr.detectChanges();
    this.rerender = true;
  }

  changeLocaleId(value): void {
    localStorage.setItem('localeId', value);
    this.localeService.changeLocaleId(value);
    this.localeService.reload();
    this.currentLocaleId = value;
  }

  changeValue($event): void {
    this.value = $event;
  }
}

