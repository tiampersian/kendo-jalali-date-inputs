import { ChangeDetectorRef, Component, Inject, LOCALE_ID, Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { RTL } from '@progress/kendo-angular-l10n';
import { DatePickerType, JalaliCldrIntlService } from '@progress/kendo-jalali-date-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    // { provide: LOCALE_ID, useFactory: localeIdFactory, deps: ['LOCALE_ID'] },
  ],

})
export class AppComponent {
  title = 'kendo-jalali-datepicker';
  public value: Date = new Date();
  rerender = true;
  locales = ['fa-IR', 'en-US', 'en'];
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
  }

  changeValue($event): void {
    debugger
    this.value = $event;
  }
}

export function isRtl(intlService: JalaliCldrIntlService): boolean {
  return intlService.localeId === 'fa-IR';
}
export function localeIdFactory(originalLocalId: string): string {
  return localStorage.getItem('localeId') || originalLocalId || 'fa-IR';
}
