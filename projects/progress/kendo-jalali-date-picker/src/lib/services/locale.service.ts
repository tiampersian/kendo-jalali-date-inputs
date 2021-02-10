import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
export enum DatePickerType {
  jalali = 'jalali',
  gregorian = 'gregorian'
};

@Injectable()
export class JalaliCldrIntlService extends CldrIntlService {
  isJalali: boolean;
  // isIranTimezone = false;
  isGregorian: boolean;
  datePickerType: DatePickerType;
  defaultTitleTemplate: any;
  localeIdByDatePickerType = '';

  constructor(
    @Inject(LOCALE_ID) private originalLocaleId: string
  ) {
    super(originalLocaleId);
    // this.isIranTimezone = this.originalLocaleId === 'fa-IR';
    this.changeType();
  }
  setTitleTemplate(template) {
    this.defaultTitleTemplate = template;
  }

  changeType(value?: DatePickerType) {
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

  reload() {
    this.changes.next(super.localeId);
    this.notify();
      const tem = super.localeId;
    this.changeLocaleId('en');
    this.changeLocaleId(tem);
  }

  changeLocaleId(value) {
    super.localeId = value;
    this.notify();
  }

  toggleType() {
    this.changeType(this.datePickerType === DatePickerType.jalali ? DatePickerType.gregorian : DatePickerType.jalali);
  }

  private getType(value: DatePickerType): DatePickerType {
    return value || (this.originalLocaleId !== 'fa-IR' ? DatePickerType.gregorian : DatePickerType.jalali);
  }
}
