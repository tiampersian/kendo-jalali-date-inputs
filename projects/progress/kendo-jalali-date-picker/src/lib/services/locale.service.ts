import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
export enum DatePickerType {
  jalali = 'jalali',
  gregorian = 'gregorian'
};

@Injectable()
export class JalaliCldrIntlService extends CldrIntlService {
  isJalali: boolean;
  isIranTimezone = false;
  isGregorian: boolean;
  datePickerType: DatePickerType;

  constructor(
    @Inject(LOCALE_ID) private originalLocaleId: string
  ) {
    super(originalLocaleId);
    this.isIranTimezone = this.originalLocaleId === 'fa-IR';
    this.changeType();
  }

  changeType(value?: DatePickerType) {
    this.datePickerType = this.getType(value);
    if (this.datePickerType === DatePickerType.jalali) {
      this.isJalali = true;
      this.isGregorian = false;
      super.localeId = 'fa';

      return;
    }
    this.isJalali = false;
    this.isGregorian = true;
    super.localeId = this.originalLocaleId;

  }

  toggleType() {
    this.changeType(this.datePickerType === DatePickerType.jalali ? DatePickerType.gregorian : DatePickerType.jalali);
  }

  private getType(value: DatePickerType): DatePickerType {
    return value || (this.originalLocaleId !== 'fa-IR' ? DatePickerType.gregorian : DatePickerType.jalali);
  }
}
