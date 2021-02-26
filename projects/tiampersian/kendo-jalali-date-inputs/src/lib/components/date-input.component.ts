import { DateInputComponent } from '@progress/kendo-angular-dateinputs';
import moment from 'jalali-moment';
import { JalaliCldrIntlService } from '../services/locale.service';

const formats = {
  'fa-IR': {
    g: 'YYYY/D/M hh:mm a',
    d: 'YYYY/M/D',
    t: 'h:mm a'
  },
  g: 'M/DD/yyyy hh:mm a',
  d: 'M/D/yyyy',
  t: 'a h:mm'
};

// const inputFormats = {
//   g: 'M/D/YYYY hh:mm:ss',
//   d: 'M/D/YYYY',
//   'dd/MM/yyyy': 'M/D/YYYY'
// };
const symbolMap = {
  'd': 'D',
  'm': 'M'
};

// tslint:disable-next-line:no-string-literal
DateInputComponent.prototype['updateElementValue'] = function (isActive: boolean): void {
  const start = this.caret()[0]; //XXX: get caret position before input is updated
  const format = this.isActive ? this.inputFormat : this.displayFormat;
  const texts = this.kendoDate.getTextAndFormat(format);
  const showPlaceholder = !this.isActive && isPresent(this.placeholder) && !this.kendoDate.hasValue();
  const input = this.inputElement;
  this.currentFormat = getTextAndFormat(this.value, texts[1], (this.intl as JalaliCldrIntlService).localeIdByDatePickerType);
  this.currentValue = !showPlaceholder ? texts[0] : '';
  let value = this.intl.parseDate(this.currentValue, this.inputFormat) || this.currentValue;
  const localeId = this.intl.localeIdByDatePickerType;
  if (moment.isDate(value)) {
    let _format = (formats[this.intl.locale] ? formats[this.intl.locale][format] : formats[format]) || format;

    _format = _format.replace(/\w/g, function (match) {
      if (!symbolMap[match]) {
        return match;
      }
      return symbolMap[match];
    })
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
};
const oldHandleInput = DateInputComponent.prototype['handleInput']
DateInputComponent.prototype['handleInput'] = function () {
  const me: DateInputComponent = this;
  if ((this.intl as JalaliCldrIntlService).localeId === 'fa-IR') {
    me.inputElement.value = (me.inputElement.value as string).toPerNumber();
  }
  if ((this.intl as JalaliCldrIntlService).localeIdByDatePickerType === 'fa') {
    if (moment((this.inputValue as string).toEnNumber()).locale('fa').isValid()) {
      let _format = (formats[this.intl.locale] ? formats[this.intl.locale][this.format] : formats[this.format]) || this.format;

      _format = _format.replace(/\w/g, function (match) {
        if (!symbolMap[match]) {
          return match;
        }
        return symbolMap[match];
      });
      this.value = moment.from((this.inputValue as string).toEnNumber(),'fa', _format).toDate();
      this.currentValue=this.value;
    }
  }

  oldHandleInput.call(this);
}
// const oldHandleKeydown = DateInputComponent.prototype['handleKeydown']
// DateInputComponent.prototype['handleKeydown'] = function (event) {
//   oldHandleKeydown.call(this, event);
// }
export const isPresent = (value) => value !== undefined && value !== null;
export const getTextAndFormat = (value: Date, format: string, localeId: string) => {
  if (localeId != 'fa') {
    return format;
  }
  if (!value) {
    return format;
  }
  const m = moment(value);
  const dt = moment(value).locale(localeId);
  const MAX_VALUE = 9;
  if ((dt.date() > MAX_VALUE) !== (m.date() > MAX_VALUE)) {
    if (dt.date() < MAX_VALUE) {
      format = format.replace(/(dd|DD)/g, (match) => {
        return match[0];
      });
    } else {
      format = format.replace(/(d|D)/g, (match) => {
        return match + match;
      });
    }
  }
  if ((dt.month() > MAX_VALUE) !== (m.month() > MAX_VALUE)) {
    if (dt.month() < MAX_VALUE) {
      format = format.replace(/(mm|MM)/g, (match) => {
        return match[0];
      });
    } else {
      format = format.replace(/(m|M)/g, (match) => {
        return match + match;
      });
    }
  }
  return format;
}
