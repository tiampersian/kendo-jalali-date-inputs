import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import dayjs from 'dayjs';
import { IConfig } from '../models/config.model';


@Injectable()
export class DateTimeNumberService {
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
