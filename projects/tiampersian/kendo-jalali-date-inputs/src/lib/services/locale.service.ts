import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { CldrIntlService } from '@progress/kendo-angular-intl';
import { Subject } from 'rxjs';
import { NumberPipe } from '../pipes/number.pipe';
import {
  MomentNumberService
} from './moment-numbers';
export enum DatePickerType {
  jalali = 'jalali',
  gregorian = 'gregorian'
}

@Injectable()
export class JalaliCldrIntlService extends CldrIntlService {
  isJalali: boolean;
  isGregorian: boolean;
  datePickerType: DatePickerType;
  localeIdByDatePickerType = '';
  get isLocaleIran(): boolean {
    return this.localeId === 'fa-IR';
  }
  defaultTitleTemplate: any;
  $calendarType = new Subject();
  isFirst = true;

  constructor(
    @Inject(LOCALE_ID) private originalLocaleId: string,
    private momentNumberService: MomentNumberService
  ) {
    super(originalLocaleId);
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
  }

  toggleType(): void {
    this.changeType(this.datePickerType === DatePickerType.jalali ? DatePickerType.gregorian : DatePickerType.jalali);
    if (this.isFirst) {
      this.isFirst = false;
      setTimeout(() => {
        this.toggleType();
        setTimeout(() => {
          this.toggleType();
        }, 10);
      }, 10);
    }
  }

  private getType(value: DatePickerType): DatePickerType {
    if (value) { return value; }

    if (this.originalLocaleId === 'fa-IR' || this.originalLocaleId === 'fa') {
      return DatePickerType.jalali;
    }

    return DatePickerType.gregorian;
  }
}
