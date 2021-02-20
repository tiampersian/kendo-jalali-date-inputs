import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import moment from 'jalali-moment';

const symbolMap = {
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
const numberMap = {
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

@Injectable()
export class MomentNumberService {
  localeId: string;

  constructor(
    @Inject(LOCALE_ID) localeId: string
  ) {
    this.setLocaleId(localeId);
    this.init()
  }

  setLocaleId(value: string) {
    this.localeId = value;
  }

  init() {
    const me = this;
    const te = moment.fn.format;
    (<any>moment).fn.format = function (format) {
      if (me.localeId !== 'fa-IR') {
        return te.call(this, format);
      }
      let result = te.call(this, format);
      result = result.replace(/\d/g, function (match) {
        return symbolMap[match];
      }).replace(/,/g, '،')
      return result;
    };
    // moment.updateLocale('fa', {
    //   preparse: function (v) {
    //     if (me.localeId === 'fa-IR') {
    //       return v;
    //     }
    //     return v.replace(/\u200f/g, '').replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
    //       return numberMap[match];
    //     }).replace(/،/g, ',');
    //   },
    //   postformat: function (v) {
    //     if (me.localeId !== 'fa-IR') {
    //       return v;
    //     }
    //     return v.replace(/\d/g, function (match) {
    //       return symbolMap[match];
    //     }).replace(/,/g, '،');
    //   },
    // })
  }
}
