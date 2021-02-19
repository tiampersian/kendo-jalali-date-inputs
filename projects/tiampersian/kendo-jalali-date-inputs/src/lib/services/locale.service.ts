import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { CldrIntlService } from '@progress/kendo-angular-intl';
export enum DatePickerType {
  jalali = 'jalali',
  gregorian = 'gregorian'
}

@Injectable()
export class JalaliCldrIntlService extends CldrIntlService {
  isJalali: boolean;
  // isIranTimezone = false;
  isGregorian: boolean;
  datePickerType: DatePickerType;
  localeIdByDatePickerType = '';
  defaultTitleTemplate: any;

  constructor(
    @Inject(LOCALE_ID) private originalLocaleId: string,
    // @Optional() @Inject('HeaderTitleTemplate') public defaultTitleTemplate?: any
  ) {
    super(originalLocaleId);
    // this.isIranTimezone = this.originalLocaleId === 'fa-IR';
    this.changeType();
  }

  setTitleTemplate(template): void {
    this.defaultTitleTemplate = template;
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
    this.changes.next(super.localeId);
    this.notify();
    const tem = super.localeId;
    this.changeLocaleId('en');
    this.changeLocaleId(tem);
  }

  changeLocaleId(value): void {
    super.localeId = value;
    this.notify();
  }

  toggleType(): void {
    this.changeType(this.datePickerType === DatePickerType.jalali ? DatePickerType.gregorian : DatePickerType.jalali);
  }

  private getType(value: DatePickerType): DatePickerType {
    return value || (this.originalLocaleId !== 'fa-IR' ? DatePickerType.gregorian : DatePickerType.jalali);
  }
}
