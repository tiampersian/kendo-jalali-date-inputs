import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { DatePickerType, JalaliCldrIntlService, KendoJalaliDateInputsModule } from '@tiampersian/kendo-jalali-date-inputs';

@Component({
  imports: [
    KendoJalaliDateInputsModule,
    DateInputsModule,
    FormsModule,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = 'kendo-jalali-date-inputs';
  public value: Date = new Date();
  rerender = false;
  locales = ['fa-IR', 'fa', 'en-US', 'en'];
  calendarTypes = Object.values(DatePickerType);
  calendarType = '';
  currentLocaleId = '';
  private localeService = inject(IntlService) as JalaliCldrIntlService;
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.calendarType = this.localeService.isJalali ? DatePickerType.jalali : DatePickerType.gregory;
    this.currentLocaleId = this.localeService.localeId;
  }

  changeCalendarType(value: string): void {
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

  changeLocaleId(value: any): void {
    localStorage.setItem('localeId', value);
    this.localeService.changeLocaleId(value);
    this.localeService.reload();
    this.currentLocaleId = value;
  }

  changeValue($event: any): void {
    this.value = $event;
  }
}

