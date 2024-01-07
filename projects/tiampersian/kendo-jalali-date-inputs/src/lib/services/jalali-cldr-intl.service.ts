import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CldrIntlService, NumberFormatOptions } from '@progress/kendo-angular-intl';
import dayjs, { Dayjs } from 'dayjs';
import { Subject } from 'rxjs';
import { DatePickerType } from '../models/date-picker-type';
import { DateTimeNumberService } from './date-time-number.service';

@Injectable({
  providedIn: 'root',
})
export class JalaliCldrIntlService extends CldrIntlService {
  isJalali: boolean;
  isGregorian: boolean;
  datePickerType: DatePickerType;
  localeIdByDatePickerType = '';
  get isLocaleIran(): boolean {
    return this.localeId === 'fa-IR' || this.localeId === 'fa';
  }
  get calendarType(): any {
    return this.localeIdByDatePickerType === 'fa' ? 'jalali' : 'gregory';
  }
  static staticDefaultTitleTemplate: any;
  $calendarType = new Subject();
  isFirst = true;
  jalaliMonths: string[];
  gregorianMonths: string[];


  constructor(
    @Inject(LOCALE_ID) private originalLocaleId: string,
    private momentNumberService: DateTimeNumberService
  ) {
    super(originalLocaleId);
    this.changeType();

    this.prepareMonthData();
  }

  private prepareMonthData() {
    this.jalaliMonths = Array.from(Array(12).keys()).map((x, i) => {
      return this.getDayJsValue('' + (i + 1)).format('MMMM');
    });
    this.jalaliMonths.splice(this.jalaliMonths.length, 0, ...this.jalaliMonths.splice(0, 3));
    this.gregorianMonths = this.getDayJsValue().localeData().monthsShort();
  }

  firstDay(localeId?: string): number {
    return super.firstDay(this.localeIdByDatePickerType);
  }

  setTitleTemplate(template): void {
    JalaliCldrIntlService.staticDefaultTitleTemplate = template;
  }

  changeType(value?: DatePickerType): void {
    this.datePickerType = this.getType(value);
    
    if (this.datePickerType === DatePickerType.jalali) {
      this.isJalali = true;
      this.isGregorian = false;
      this.localeIdByDatePickerType = 'fa';
      this.reload();
      return;
    }
    this.isJalali = false;
    this.isGregorian = true;
    this.localeIdByDatePickerType = 'en';
    this.reload();
  }

  reload(): void {
    const tem = super.localeId;
    this.changeLocaleId('en');
    this.changeLocaleId(tem);
    this.$calendarType.next(this.localeIdByDatePickerType);
    this.changes.next(super.localeId);
  }

  changeLocaleId(value): void {
    super.localeId = value;
    this.momentNumberService.setLocaleId(value);
    this.notify();
    this.prepareMonthData();
  }

  toggleType(): void {
    this.changeType(this.datePickerType === DatePickerType.jalali ? DatePickerType.gregory : DatePickerType.jalali);
    if (this.isFirst) {
      this.isFirst = false;
      // to fix old version of chrome
      // setTimeout(() => {
      //   this.toggleType();
      //   setTimeout(() => {
      //     this.toggleType();
      //   }, 0);
      // }, 0);
    }
  }

  private getType(value: DatePickerType): DatePickerType {
    if (value) { return value; }

    if (this.originalLocaleId === 'fa-IR' || this.originalLocaleId === 'fa') {
      return DatePickerType.jalali;
    }

    return DatePickerType.gregory;
  }

  formatNumber(value: number, format: string | NumberFormatOptions, localeId?: string): string {
    localeId = localeId || this.localeId;
    if (this.isJalali && (localeId === 'fa' || localeId === 'ar')) {
      try {
        return super.formatNumber(value, format, localeId).toPerNumber();
      } catch (error) {

      }
    }
    return super.formatNumber(value, format, localeId);
  }

  getDayJsValue(value?: Date | string, localeId?: string): Dayjs {
    return dayjs(value).calendar(this.calendarType).locale(localeId || this.localeId);
  }
}
