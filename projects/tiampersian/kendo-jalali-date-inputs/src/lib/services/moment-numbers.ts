import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import dayjs from 'dayjs';
import { IConfig } from '../models/config.model';
declare global {
  interface String {
    toPerNumber(): string;
    toEnNumber(): string;
    toMomentDateTimeFormat(): string;
    revertPersianWord(): string;
  }
}

String.prototype.toPerNumber = function () {
  return this.replace(/\d/g, (match) => {
    return enToPerNumberMap[match] || match;
  });
};
String.prototype.toEnNumber = function () {
  return this.replace(/[١٢٣٤٥٦٧٨٩٠]/g, (match) => {
    return perToEnNumberMap[match] || match;
  });
};
String.prototype.toMomentDateTimeFormat = function () {
  let x = this.replace(/d/g, 'D')
  .replace(/aa/ig, (m) => m[0])
  .replace(/_/g, '/')
  .replace(/[y]{1,}/, 'YYYY');

  return x;
};
String.prototype.revertPersianWord = function () {
  return this.replace(/(?:(?![٠-٩])[\u0600-\u06FF]){2,}/g, (m) => reverseString(m));
};
export const enToPerNumberMap = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠'
};
export const perToEnNumberMap = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0'
};
export const reverseString = str => [...str].reverse().join('');

@Injectable()
export class MomentNumberService {
  usePersianNumber: boolean;

  constructor(
    @Inject(LOCALE_ID) localeId: string,
    @Inject('CONFIGS') private configs: IConfig
  ) {
    this.setLocaleId(localeId);
    this.init();
  }

  setLocaleId(value: string) {
    this.usePersianNumber = value === 'fa' || value === 'fa-IR';
  }

  init() {
    if (this.configs?.usePersianNumber === false) {
      return;
    }
    const me = this;
    // dayjs.localeData().months();
    const te = dayjs.prototype.format;
    dayjs.prototype.format = function (format) {

      if (!me.usePersianNumber) {
        return te.call(this, format);
      }

      let result = te.call(this, format);
      result = result.toPerNumber().replace(/,/g, '،');
      return result;
    };
  }
}
