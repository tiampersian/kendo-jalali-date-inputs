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
let locale = '';
// tslint:disable-next-line:no-string-literal
DateInputComponent.prototype['updateElementValue'] = function (isActive: boolean): void {
  const start = this.caret()[0]; //XXX: get caret position before input is updated
  const format = this.isActive ? this.inputFormat : this.displayFormat;
  const texts = this.kendoDate.getTextAndFormat(format);
  const showPlaceholder = !this.isActive && isPresent(this.placeholder) && !this.kendoDate.hasValue();
  const input = this.inputElement;
  this.currentFormat = getTextAndFormat(this.value, texts[1], locale || (this.intl as JalaliCldrIntlService).localeIdByDatePickerType);
  this.currentValue = !showPlaceholder ? texts[0] : '';
  let value = this.intl.parseDate(this.currentValue, this.inputFormat) || this.currentValue;
  const localeId = this.intl.localeIdByDatePickerType;
  if (moment.isDate(value)) {
    // let _format = (formats[this.intl.locale] ? formats[this.intl.locale][format] : formats[format]) || format;
    // _format = _format.replace(/\w/g, function (match) {
    //   if (!symbolMap[match]) {  return match;  }
    //   return symbolMap[match];
    // })
    setInputValue.call(this, value, localeId);
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

  if (me.disabled || me.readonly) {
    return;
  }
  if (this.paste) {
    this.updateOnPaste();
    this.paste = false;
    return;
  }
  const intl = (this.intl as JalaliCldrIntlService);
  let diff = [];

  let _format: string = (formats[this.intl.locale] ? formats[this.intl.locale][this.format] : formats[this.format]) || this.format;
  _format = _format.replace(/\w/g, function (match) {
    if (!symbolMap[match]) {
      return match;
    }
    return symbolMap[match];
  });
  let locale = intl.localeIdByDatePickerType;
  let currentValue = moment.from((this.inputValue as string).toEnNumber(), 'fa', _format.toUpperCase());

  diff = approximateStringMatching(this.currentValue, this.currentFormat, this.inputValue.toEnNumber(), this.caret()[0])
  const currentValueAsEn = moment(currentValue.toDate()).locale('en');
  // this.inputElement.value = currentValueAsEn.format('YYYY/MM/DD').toEnNumber();
  // const diff = approximateStringMatching(this.currentValue, this.currentFormat, this.inputValue, this.caret()[0]);

  if (locale === 'fa') {
    setInputValue.call(this, currentValue.toDate(), 'en');
    diff.forEach(x => {
      if ((x[0] as string).toLocaleLowerCase() === 'm') {
        x[1] = currentValueAsEn.format('MM').toEnNumber();
      }
      if ((x[0] as string).toLocaleLowerCase() === 'd') {
        x[1] = currentValueAsEn.format('DD').toEnNumber();
      }
    });
  }
  const navigationOnly = (diff.length === 1 && diff[0][1] === "_");
  let switchPart = false;
  if (!navigationOnly) {
    let parsedPart;
    for (let i = 0; i < diff.length; i++) {
      parsedPart = this.kendoDate.parsePart(diff[i][0], diff[i][1], this.resetSegmentValue);
      switchPart = parsedPart.switchToNext;
    }
    const candidate = this.kendoDate.getDateObject();
    if (this.value && candidate && !this.formatSections.date) {
      this.kendoDate = this.getKendoDate(setTime(this.value, candidate));
    }
  }
  this.resetSegmentValue = false;
  this.putDateInRange();
  locale = 'en';
  this.updateElementValue(this.isActive);
  locale = '';

  this.triggerChange();
  this.updateIncompleteValidationStatus();
  if (diff.length && diff[0][0] !== "_") {
    this.selectDateSegment(diff[0][0]);
  }
  if (switchPart || navigationOnly) {
    this.switchDateSegment(1);
  }
  if (this.backspace) {
    this.switchDateSegment(-1);
  }
  this.backspace = false;
  if (intl.localeId === 'fa-IR') {
    me.inputElement.value = (me.inputElement.value as string).toPerNumber();
  }
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
  if (moment(value).format('y').length < 4) {
    localeId='en'
  }
  const dt = moment(value).locale(localeId);
  const MAX_VALUE = 9;
  if ((dt.date() > MAX_VALUE) !== (m.date() > MAX_VALUE)) {
    if (dt.date() < MAX_VALUE) {
      format = format.replace(/(dd|DD)/g, (match) => {
        return match[0];
      });
    } else if (format.search(/(dd|DD)/g) === -1) {
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
    } else if (format.search(/(mm|MM)/g) === -1) {
      format = format.replace(/(m|M)/g, (match) => {
        return match + match;
      });
    }
  }
  return format;
}

export const approximateStringMatching = (oldTextOrigin, oldFormat, newTextOrigin, caret) => {
  // Remove the right part of the cursor.
  //oldFormat = oldFormat.substring(0, caret + oldText.length - newText.length);
  const oldIndex = caret + oldTextOrigin.length - newTextOrigin.length;
  const oldTextSeparator = oldTextOrigin[oldIndex];
  const oldText = oldTextOrigin.substring(0, caret + oldTextOrigin.length - newTextOrigin.length);
  const newText = newTextOrigin.substring(0, caret);
  const diff = [];
  // Handle typing a single character over the same selection.
  if (oldText === newText && caret > 0) {
    diff.push([oldFormat[caret - 1], newText[caret - 1]]);
    return diff;
  }
  if (oldText.indexOf(newText) === 0 && (newText.length === 0 || oldFormat[newText.length - 1] !== oldFormat[newText.length])) {
    // Handle Delete/Backspace.
    let deletedSymbol = "";
    //XXX:
    // Whole text is replaced with a same char
    // Nasty patch required to keep the selection in the first segment
    if (newText.length === 1) {
      diff.push([oldFormat[0], newText[0]]);
    }
    for (let i = newText.length; i < oldText.length; i++) {
      if (oldFormat[i] !== deletedSymbol && oldFormat[i] !== "_") {
        deletedSymbol = oldFormat[i];
        diff.push([deletedSymbol, ""]);
      }
    }
    return diff;
  }
  // Handle inserting text (the new text is longer than the previous one).
  // Handle typing over a literal as well.
  if (newText.indexOf(oldText) === 0 || oldFormat[caret - 1] === "_") {
    let symbol = oldFormat[0];
    for (let i = Math.max(0, oldText.length - 1); i < oldFormat.length; i++) {
      if (oldFormat[i] !== "_") {
        symbol = oldFormat[i];
        break;
      }
    }
    return [[symbol, newText[caret - 1]]];
  }
  // Handle entering a space or a separator, for navigation to the next item.
  if (newText[newText.length - 1] === " " || (newText[newText.length - 1] === oldTextSeparator && oldFormat[oldIndex] === '_')) {
    return [[oldFormat[caret - 1], "_"]];
  }
  // Handle typing over a correctly selected part.
  return [[oldFormat[caret - 1], newText[caret - 1]]];
};
export const setTime = (origin, candidate) => {
  const date = new Date(origin);
  date.setHours(candidate.getHours(), candidate.getMinutes(), candidate.getSeconds(), candidate.getMilliseconds());
  return date;
};
function setInputValue(value: Date, localeId: any) {
  const f = (this.currentFormat as string).replace(/d/g, 'D').replace(/_/g, '/');
  if (moment(value).format('y').length < 4) {
    const dt = moment.from((this.inputValue as string).toEnNumber(), 'en', f);
    this.currentFormat = this.kendoDate.dateFormatString(dt.toDate(), this.format).symbols.replace(/_/g, '/');
    this.renderer.setProperty(this.inputElement, 'value', dt.format(f));
    return;
  }
  const m = moment(value).locale(localeId);
  this.renderer.setProperty(this.inputElement, 'value', m.format(f));
}

