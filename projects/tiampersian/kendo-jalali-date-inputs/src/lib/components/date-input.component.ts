import { DateInputComponent } from '@progress/kendo-angular-dateinputs';
import moment from 'jalali-moment';
import { JalaliCldrIntlService } from '../services/locale.service';


const existInputs = {
  'm': false,
  'd': false,
  'y': false
};
// tslint:disable-next-line:no-string-literal
const old = DateInputComponent.prototype['updateElementValue'];
DateInputComponent.prototype['updateElementValue'] = function (isActive: boolean): void {
  if (window['useOld']) {
    old.call(this, isActive);
    return;
  }
  const start = this.caret()[0]; //XXX: get caret position before input is updated
  const format = this.isActive ? this.inputFormat : this.displayFormat;
  const localeId = (this.intl as JalaliCldrIntlService).localeIdByDatePickerType;
  const showPlaceholder = !this.isActive && isPresent(this.placeholder) && !this.kendoDate.hasValue();
  const input = this.inputElement;
  // const texts = this.kendoDate.getTextAndFormat(format);
  this.currentFormat = getDateFormatString.call(this, format, localeId);
  this.currentValue = !showPlaceholder ? this.intl.formatDate(this.kendoDate.value, format) : '';
  let value = this.intl.parseDate(this.currentValue, this.inputFormat) || this.currentValue;
  if (moment.isDate(value)) {
    setInputValue.call(this, value, localeId);
  } else {
    this.renderer.setProperty(input, 'value', this.currentValue);
  }
  if (input.placeholder !== '' + this.placeholder) {
    this.renderer.setProperty(input, "placeholder", this.placeholder);
  }
  if (isActive) {
    this.selectNearestSegment(start);
  }
};
const oldHandleInput = DateInputComponent.prototype['handleInput'];
DateInputComponent.prototype['handleInput'] = function () {
  if (window['useOld']) {
    oldHandleInput.call(this);
    return;
  }
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

  let prevValue = this.currentValue;
  if (intl.localeIdByDatePickerType === 'fa') {
    prevValue = this.value ? getValue.call(this, this.value).format(this.currentFormat.toMomentDateTimeFormat()).toEnNumber() : this.currentValue;
  }

  diff = approximateStringMatching(prevValue, this.currentFormat, this.inputValue.toEnNumber(), this.caret()[0]);

  prepareDiffInJalaliMode.call(this, intl, diff);
  const navigationOnly = (diff.length === 1 && diff[0][1] === "_");
  let switchPart = false;
  console.log('diff', diff);
  if (!navigationOnly) {
    let parsedPart;
    for (let i = 0; i < diff.length; i++) {
      if (diff[i][2] === undefined) {
        parsedPart = this.kendoDate.parsePart(diff[i][0], diff[i][1], this.resetSegmentValue);
      }
      switchPart = diff[i][2] !== undefined ? diff[i][2] : parsedPart.switchToNext;
      if (diff[i][3]) {
        this.kendoDate.value = diff[i][3];
      }
      if (diff[i][4]) {
        this.kendoDate[diff[i][4]] = false;
      }
    }
    const candidate = this.kendoDate.getDateObject();
    if (this.value && candidate && !this.formatSections.date) {
      this.kendoDate = this.getKendoDate(setTime(this.value, candidate));
    }
  }
  this.resetSegmentValue = false;
  this.putDateInRange();
  this.updateElementValue(this.isActive);

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
};

class Mask {
  symbols = "";
  partMap;
}

function dateFormatString(date, format) {
  const dateFormatParts = this.kendoDate.intl.splitDateFormat(format);
  const parts = [];
  const partMap = [];
  for (let i = 0; i < dateFormatParts.length; i++) {
    let partLength = getValue.call(this, date)?.format(dateFormatParts[i].pattern?.replace(/d/g, 'D')).length || 0;
    while (partLength > 0) {
      parts.push(this.kendoDate.symbols[dateFormatParts[i].pattern[0]] || "_");
      partMap.push(dateFormatParts[i]);
      partLength--;
    }
  }
  const returnValue = new Mask();
  returnValue.symbols = parts.join("");
  returnValue.partMap = partMap;
  return returnValue;
}

const oldHandleBlur = DateInputComponent.prototype['handleBlur'];
DateInputComponent.prototype['handleBlur'] = function (event) {
  oldHandleBlur.call(this, event);
  resetExistingInputs();
};

function prepareDiffInJalaliMode(intl: JalaliCldrIntlService, diff: any[]) {
  if (intl.localeIdByDatePickerType !== 'fa') {
    return;
  }
  const dt = getValue.call(this, this.kendoDate.value, 'fa');
  if (!dt) {
    return;
  }
  if (debuggerCounter(1)) { }

  diff.forEach(d => {
    if (!d[0]) {
      debugger
      return;
    }
    if ((d[0] as string).toLocaleLowerCase() === 'm') {

      let month = d[1];
      if (existInputs.m) {
        d[2] = true;
        month = +(dt.month() + 1) + d[1];
        if (!this.kendoDate.month) {
          month = 0 + d[1];
        }
        resetExistingInputs();
      } else {
        d[2] = +month > 1;
        existInputs.m = !d[2];
      }
      if (month === '0') {
        d[3] = dt.set('month', 0).toDate();
        d[4] = 'month';
        return;
      }

      this.kendoDate.value = (dt.set('month', month - 1).toDate());
      d[1] = '' + (dt.locale('en').month() + 1);

      return;
    }
    if ((d[0] as string).toLocaleLowerCase() === 'd') {
      let day = d[1];
      if (existInputs.d) {
        d[2] = true;
        day = +(dt.date()) + d[1];
        if (!this.kendoDate.date) {
          day = 0 + d[1];
        }
        resetExistingInputs();
      } else {
        d[2] = +day > 3;
        existInputs.d = !d[2];
      }
      if (day === '0') {
        d[3] = dt.set('date', 1).toDate();
        d[4] = 'date';
        return;
      }
      dt.set('date', +day);
      this.kendoDate.value = (dt.toDate());

      d[1] = '' + (dt.locale('en').date());
      return;
    }
    if (d[0].toLocaleLowerCase() === 'y') {
      d[1] = prepareYearValue.call(this, d);
    }
  });
}
const MIN_DATE_FA = moment.from('0001-01-01', 'fa', 'YYYY/MM/DD').diff(moment('0001-01-01'), 'year') + 1;

function prepareYearValue(diff: any[]) {

  if (!diff[1]) {
    debugger

    return diff[1];
  }
  var temp = +diff[1];
  if (!existInputs.y || !temp || moment(this.value).locale('en').format('y').length > 3) {
    existInputs.y = true;
    return '' + ((+diff[1]) + MIN_DATE_FA);
  }

  const yearsInGregorian = '' + (+('' + (this.value.getFullYear() % MIN_DATE_FA) + temp) + MIN_DATE_FA);
  const current = yearsInGregorian.slice(0, yearsInGregorian.length - 1);
  this.kendoDate.value = (moment(this.kendoDate.value).year(+current).toDate());
  if (!(this.kendoDate.value as Date).getTime()) {
    debugger
  }
  if (yearsInGregorian.length > 3) {
    resetExistingInputs();
    diff[2] = true;
  }
  return yearsInGregorian.slice(yearsInGregorian.length - 1);
}

export function getDateFormatString(format: string, localeId: string, value?: Date) {
  const dt = getValue.call(this, (value || this.kendoDate.value), localeId)?.toDate();
  return dateFormatString.call(this, dt, format, localeId)?.symbols || '';
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

export const isPresent = (value) => value !== undefined && value !== null;

function setInputValue(value: Date, localeId: any) {
  let format = this.format;
  if (['d', 't', 'g'].some(x => x == format)) {
    format = this.currentFormat.toMomentDateTimeFormat();
  }
  this.renderer.setProperty(this.inputElement, 'value', getValue.call(this, value, localeId).format(format.replace(/d/g, 'D')));
}

// function excludeFromFormat(format: string, item: string) {
//   return format.replace(new RegExp(item, 'gi'), '').replace('//', '/').replace(/^\//, '');
// }

function getValue(value: Date | string, localeId?: string) {
  if (!value) {
    return null;
  }
  let formatter = (localeId || this.intl.localeIdByDatePickerType) == 'fa' ? 'doAsJalali' : 'doAsGregorian';
  return moment(value).locale(this.intl.localeId)[formatter]();
}


function resetExistingInputs() {
  existInputs.m = false;
  existInputs.d = false;
  existInputs.y = false;
}
window['counter'] = 0;
function debuggerCounter(counter) {
  const result = window['counter'] === counter;
  window['counter']++;
  if (result) {
    window['counter'] = 0;
  }
  return result;
}
