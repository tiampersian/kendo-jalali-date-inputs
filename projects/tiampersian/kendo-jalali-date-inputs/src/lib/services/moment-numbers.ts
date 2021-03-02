import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import moment from 'jalali-moment';
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
  })
}
String.prototype.toEnNumber = function () {
  return this.replace(/[١٢٣٤٥٦٧٨٩٠]/g, (match) => {
    return perToEnNumberMap[match] || match;
  })
}
String.prototype.toMomentDateTimeFormat = function () {
  return this.replace(/d/g, 'D').replace(/aa/ig, (m) => m[0]).replace(/_/g, '/')
}
String.prototype.revertPersianWord = function () {
  return this.replace(/(?:(?![٠-٩])[\u0600-\u06FF]){2,}/g, (m) => reverseString(m));
}
export const enToPerNumberMap = {
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '0': '٠'
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
}
export const reverseString = str => [...str].reverse().join('');

@Injectable()
export class MomentNumberService {
  localeId: string;

  constructor(
    @Inject(LOCALE_ID) localeId: string,
    @Inject('CONFIGS') private configs: IConfig
  ) {
    this.setLocaleId(localeId);
    this.init()
  }

  setLocaleId(value: string) {
    this.localeId = value;
  }

  init() {
    if (this.configs?.usePersianNumber === false) {
      return;
    }
    const me = this;
    moment.localeData().months()
    const te = moment.fn.format;
    (<any>moment).fn.format = function (format) {

      if (me.localeId !== 'fa-IR') {
        return te.call(this, format);
      }

      let result = te.call(this, format);
      result = result.toPerNumber().replace(/,/g, '،')
      return result;
    };
  }
}
