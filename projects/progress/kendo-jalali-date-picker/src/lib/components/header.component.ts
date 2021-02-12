import { TemplateRef } from '@angular/core';
import { HeaderComponent } from '@progress/kendo-angular-dateinputs';
import { DatePickerType } from '../services/locale.service';

const calendarTypes = {
  [DatePickerType.gregorian]: $localize`:@@jalali:Jalali`,
  [DatePickerType.jalali]: $localize`:@@gregorian:Gregorian`,
};
Object.defineProperty(HeaderComponent.prototype, 'calendarType', {
  get(): string {
    debugger
    return calendarTypes[this.intl.datePickerType];
  },
  enumerable: true,
  configurable: true
});
