import { DateInputComponent } from "@progress/kendo-angular-dateinputs";
import moment from 'jalali-moment';

const formats = {
  g: 'DD/MM/YYYY hh:mm:ss',
  d: 'DD/MM/YYYY',
  t: 'h:mm a'
};
const inputFormats = {
  g: 'DD/MM/YYYY hh:mm:ss',
  d: 'DD/MM/YYYY',
  'dd/MM/yyyy': 'DD/MM/YYYY'
};
DateInputComponent.prototype['updateElementValue'] = function (isActive) {
  const start = this.caret()[0];
  const format = this.isActive ? this.inputFormat : this.displayFormat;
  const texts = this.kendoDate.getTextAndFormat(format);
  const showPlaceholder = !this.isActive && !this.kendoDate.hasValue();
  const input = this.inputElement;
  this.currentFormat = texts[1];
  this.currentValue = !showPlaceholder ? texts[0] : '';
  const value = this.intl.parseDate(this.currentValue, this.inputFormat) || this.currentValue;

  this.renderer.setProperty(input, "value", this.currentValue ? moment(value).locale('fa').format(formats[format] || format) : this.currentValue);
  if (input.placeholder !== this.placeholder) {
    this.renderer.setProperty(input, "placeholder", this.placeholder);
  }
  if (isActive) {
    this.selectNearestSegment(start);
  }
};
