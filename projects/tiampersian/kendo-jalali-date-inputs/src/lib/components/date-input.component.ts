import { DateInputComponent } from '@progress/kendo-angular-dateinputs';
import moment from 'jalali-moment';

const formats = {
  'fa-IR': {
    g: 'YYYY/D/M hh:mm a',
    d: 'YYYY/M/DD',
    t: 'h:mm a'
  },
  g: 'M/DD/yyyy hh:mm a',
  d: 'M/DD/yyyy',
  t: 'a h:mm'
};
// const inputFormats = {
//   g: 'M/D/YYYY hh:mm:ss',
//   d: 'M/D/YYYY',
//   'dd/MM/yyyy': 'M/D/YYYY'
// };
// tslint:disable-next-line:no-string-literal
DateInputComponent.prototype['updateElementValue'] = function (isActive: boolean): void {
  const start = this.caret()[0]; //XXX: get caret position before input is updated
  const format = this.isActive ? this.inputFormat : this.displayFormat;
  const texts = this.kendoDate.getTextAndFormat(format);
  const showPlaceholder = !this.isActive && isPresent(this.placeholder) && !this.kendoDate.hasValue();
  const input = this.inputElement;
  this.currentFormat = texts[1];
  this.currentValue = !showPlaceholder ? texts[0] : '';
  const value = this.intl.parseDate(this.currentValue, this.inputFormat) || this.currentValue;
  const localeId = this.intl.localeIdByDatePickerType;
  if (moment.isDate(value)) {
    const _format = (formats[this.intl.locale] ? formats[this.intl.locale][format] : formats[format]) || format;
    this.renderer.setProperty(input, 'value', moment(value).locale(localeId).format(_format));
  } else {
    this.renderer.setProperty(input, 'value', this.currentValue);
  }
  if (input.placeholder !== this.placeholder) {
    this.renderer.setProperty(input, "placeholder", this.placeholder);
  }
  if (isActive) {
    this.selectNearestSegment(start);
  }
  // const start = this.caret()[0];
  // const format = this.isActive ? this.inputFormat : this.displayFormat;
  // const texts = this.kendoDate.getTextAndFormat(format);
  // const showPlaceholder = !this.isActive && !this.kendoDate.hasValue();
  // const input = this.inputElement;
  // this.currentFormat = texts[1];
  // this.currentValue = !showPlaceholder ? texts[0] : '';
  // const value = this.intl.parseDate(this.currentValue, this.inputFormat) || this.currentValue;
  // const localeId = this.intl.localeIdByDatePickerType;
  // if (moment.isDate(value)) {
  //   this.renderer.setProperty(input, 'value', moment(value).locale(localeId).format(formats[format] || format));
  // } else {
  //   this.renderer.setProperty(input, 'value', this.currentValue);
  // }
  // if (input.placeholder !== this.placeholder) {
  //   this.renderer.setProperty(input, 'placeholder', this.placeholder);
  // }
  // if (isActive) {
  //   this.selectNearestSegment(start);
  // }
};


export const isPresent = (value) => value !== undefined && value !== null;


// let headerTitleTemplate;
// Object.defineProperty(HeaderComponent.prototype, "templateRef", {
//   get: function () {
//     return headerTitleTemplate;
//   },

//   set: function (template) {
//     const me = this as HeaderComponent;
//     const x2 = this.bus.service(this.activeView);
//     headerTitleTemplate = template || this.bus.injector.get(IntlService).defaultTitleTemplate;
//   },
//   enumerable: true,
//   configurable: true
// });
