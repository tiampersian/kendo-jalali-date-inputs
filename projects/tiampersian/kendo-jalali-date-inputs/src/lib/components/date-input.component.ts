import { DateInputComponent } from '@progress/kendo-angular-dateinputs';
import { localeData } from '@progress/kendo-angular-intl';
import { isEqual } from '@progress/kendo-date-math';
import { Constants } from '@progress/kendo-dateinputs-common/dist/es2015/common/constants';
import { DateObject } from '@progress/kendo-dateinputs-common/dist/es2015/common/dateobject';
import { Key } from '@progress/kendo-dateinputs-common/dist/es2015/common/key';
import { KeyCode } from '@progress/kendo-dateinputs-common/dist/es2015/common/keycode';
import { Mask } from '@progress/kendo-dateinputs-common/dist/es2015/common/mask';
import { parseToInt } from '@progress/kendo-dateinputs-common/dist/es2015/common/utils';
import { DateInput } from '@progress/kendo-dateinputs-common/dist/es2015/dateinput/dateinput';
import { DateInputInteractionMode } from '@progress/kendo-dateinputs-common/dist/es2015/dateinput/interaction-mode';
import { approximateStringMatching, padZero } from '@progress/kendo-dateinputs-common/dist/es2015/dateinput/utils';
import dayjs from 'dayjs';
import { JalaliCldrIntlService } from '../services/jalali-cldr-intl.service';
import { isPresent } from '../services/kendo-util-overrides';

const MONTH_PART_WITH_WORDS_THRESHOLD = 2;
const JS_MONTH_OFFSET = 1;
const MIN_JALALI_DATE = dayjs('0000-01-01', 'YYYY/MM/DD', 'fa');

DateInput.prototype.onElementInput = onElementInput;
DateInput.prototype.refreshElementValue = refreshElementValue
DateObject.prototype.dateFormatString = dateFormatString;
DateObject.prototype.getTextAndFormat = getTextAndFormat;

const oldInitKendoDate = DateInputComponent.prototype['initKendoDate'];
DateInputComponent.prototype['initKendoDate'] = function () {

  const kendoDate = oldInitKendoDate.call(this);
  if (this.value) {
    setTimeout(() => {
      this.kendoDate?.refreshElementValue();
    });
  }

  return kendoDate;
}

function onElementInput(e) {
  this.triggerInput({ event: e });
  const oldElementValue = this.elementValue;
  if (!this.element || !this.dateObject) {
    return;
  }
  const switchedPartOnPreviousKeyAction = this.switchedPartOnPreviousKeyAction;
  if (this.isPasteInProgress) {
    if (this.options.allowCaretMode) {
      // pasting should leave the input with caret
      // thus allow direct input instead of selection mode
      this.resetSegmentValue = false;
    }
    this.updateOnPaste(e);
    this.isPasteInProgress = false;
    return;
  }
  const keyDownEvent = this.keyDownEvent || {};
  const isBackspaceKey = keyDownEvent.keyCode === KeyCode.BACKSPACE || keyDownEvent.key === Key.BACKSPACE;
  const isDeleteKey = keyDownEvent.keyCode === KeyCode.DELETE || keyDownEvent.key === Key.DELETE;
  const originalInteractionMode = this.interactionMode;
  if (this.options.allowCaretMode &&
    originalInteractionMode !== DateInputInteractionMode.Caret &&
    !isDeleteKey && !isBackspaceKey) {
    this.resetSegmentValue = true;
  }
  if (this.options.allowCaretMode) {
    this.interactionMode = DateInputInteractionMode.Caret;
  }
  else {
    this.interactionMode = DateInputInteractionMode.Selection;
  }
  const hasCaret = this.isInCaretMode();
  if (hasCaret && this.keyDownEvent.key === Key.SPACE) {
    // do not allow custom "holes" in the date segments
    this.restorePreviousInputEventState();
    return;
  }
  const oldExistingDateValue = this.dateObject && this.dateObject.getValue();
  const oldDateValue = this.dateObject ? this.dateObject.value : null;
  const { text: currentText, format: currentFormat } = this.dateObject.getTextAndFormat();
  this.currentFormat = currentFormat;
  let oldText = "";
  if (hasCaret) {
    if (isBackspaceKey || isDeleteKey) {
      oldText = this.previousElementValue;
    }
    else if (originalInteractionMode === DateInputInteractionMode.Caret) {
      oldText = this.previousElementValue;
    }
    else {
      oldText = currentText;
    }
  }
  else {
    oldText = currentText;
  }
  const newText = this.elementValue;
  const diff = approximateStringMatching({
    oldText: oldText.toEnNumber(),
    newText: newText.toEnNumber(),
    formatPattern: this.currentFormat,
    selectionStart: this.selection.start,
    isInCaretMode: hasCaret,
    keyEvent: this.keyDownEvent
  });
  console.log('before diff', diff[0], (this.intl.service as JalaliCldrIntlService).calendarType);
  prepareDiffInJalaliMode.call(this, this.intl.service, diff);

  console.log('diff', diff[0]);
  console.log('leadingZero', this.dateObject.leadingZero);
  if (diff && diff.length && diff[0] && diff[0][1] !== Constants.formatSeparator) {
    this.switchedPartOnPreviousKeyAction = false;
  }
  if (hasCaret && (!diff || diff.length === 0)) {
    this.restorePreviousInputEventState();
    return;
  }
  else if (hasCaret && diff.length === 1) {
    if (!diff[0] || !diff[0][0]) {
      this.restorePreviousInputEventState();
      return;
    }
    else if (hasCaret && diff[0] &&
      (diff[0][0] === Constants.formatSeparator || diff[0][1] === Constants.formatSeparator)) {
      this.restorePreviousInputEventState();
      return;
    }
  }
  const navigationOnly = (diff.length === 1 && diff[0][1] === Constants.formatSeparator);
  const parsePartsResults = [];
  let switchPart = false;
  let error = null;
  if (!navigationOnly) {
    for (let i = 0; i < diff.length; i++) {
      const parsePartResult = this.intl.service.isGregorian ? this.dateObject.parsePart({
        symbol: diff[i][0],
        currentChar: diff[i][1],
        resetSegmentValue: this.resetSegmentValue,
        cycleSegmentValue: !this.isInCaretMode(),
        rawTextValue: this.element.value,
        isDeleting: isBackspaceKey || isDeleteKey,
        originalFormat: this.currentFormat
      }) : parsePart.call(this, diff);
      parsePartsResults.push(parsePartResult);
      if (!parsePartResult.value) {
        error = { type: "parse" };
      }
      switchPart = parsePartResult.switchToNext;
    }
  }
  if (!this.options.autoSwitchParts) {
    switchPart = false;
  }
  this.resetSegmentValue = false;
  const hasFixedFormat = this.options.format === this.currentFormat ||
    // all not fixed formats are 1 symbol, e.g. "d"
    (isPresent(this.options.format) && this.options.format.length > 1);
  const lastParseResult = parsePartsResults[parsePartsResults.length - 1];
  const lastParseResultHasNoValue = lastParseResult && !isPresent(lastParseResult.value);
  const parsingFailedOnDelete = (hasCaret && (isBackspaceKey || isDeleteKey) && lastParseResultHasNoValue);
  const resetPart = lastParseResult ? lastParseResult.resetPart : false;
  const newExistingDateValue = this.dateObject.getValue();
  const hasExistingDateValueChanged = !isEqual(oldExistingDateValue, newExistingDateValue);
  const newDateValue = this.dateObject.value;
  let symbolForSelection;
  const currentSelection = this.selection;
  if (hasCaret) {
    const diffChar = diff && diff.length > 0 ? diff[0][0] : null;
    const hasLeadingZero = this.dateObject.getLeadingZero()[diffChar];
    if (diff.length && diff[0][0] !== Constants.formatSeparator) {
      if (switchPart) {
        this.forceUpdateWithSelection();
        this.switchDateSegment(1);
      }
      else if (resetPart) {
        symbolForSelection = this.currentFormat[currentSelection.start];
        if (symbolForSelection) {
          this.forceUpdate();
          this.setSelection(this.selectionBySymbol(symbolForSelection));
        }
        else {
          this.restorePreviousInputEventState();
        }
      }
      else if (parsingFailedOnDelete) {
        this.forceUpdate();
        if (diff.length && diff[0][0] !== Constants.formatSeparator) {
          this.setSelection(this.selectionBySymbol(diff[0][0]));
        }
      }
      else if (lastParseResultHasNoValue) {
        if (e.data === '0' && hasLeadingZero) {
          // do not reset element value on a leading zero
          // wait for consecutive input to determine the value
        }
        else if (isPresent(oldExistingDateValue) && !isPresent(newExistingDateValue)) {
          this.restorePreviousInputEventState();
        }
        else if (!isPresent(oldExistingDateValue) && isPresent(newExistingDateValue)) {
          this.forceUpdateWithSelection();
        }
        else if (isPresent(oldExistingDateValue) && isPresent(newExistingDateValue)) {
          if (hasExistingDateValueChanged) {
            this.forceUpdateWithSelection();
          }
          else {
            this.restorePreviousInputEventState();
          }
        }
        else if (!isPresent(oldExistingDateValue) && !isPresent(newExistingDateValue)) {
          this.forceUpdateWithSelection();
        }
        else if (oldDateValue !== newDateValue) {
          // this can happen on auto correct when no valid value is parsed
        }
        else {
          this.restorePreviousInputEventState();
        }
      }
      else {
        // the user types a valid but incomplete date (e.g. year "123" with format "yyyy")
        // let them continue typing, but refresh for not fixed formats
        if (!hasFixedFormat) {
          this.forceUpdateWithSelection();
        }
      }
    }
    else {
      if (!this.options.autoSwitchParts && diff[0][1] === Constants.formatSeparator) {
        // do not change the selection when a separator is pressed
        // this should happen only if autoSwitchKeys contains the separator explicitly
      }
      else {
        this.setSelection(this.selectionBySymbol(diff[0][0]));
      }
    }
  }
  else if (!hasCaret) {
    this.forceUpdate();
    if (diff.length && diff[0][0] !== Constants.formatSeparator) {
      this.setSelection(this.selectionBySymbol(diff[0][0]));
    }
    if (this.options.autoSwitchParts) {
      if (navigationOnly) {
        this.resetSegmentValue = true;
        if (!switchedPartOnPreviousKeyAction) {
          this.switchDateSegment(1);
        }
        this.switchedPartOnPreviousKeyAction = true;
      }
      else if (switchPart) {
        this.switchDateSegment(1);
        this.switchedPartOnPreviousKeyAction = true;
      }
    }
    else {
      if (lastParseResult && lastParseResult.switchToNext) {
        // the value is complete and should be switched, but the "autoSwitchParts" option prevents this
        // ensure that the segment value can be reset on next input
        this.resetSegmentValue = true;
      }
      else if (navigationOnly) {
        this.resetSegmentValue = true;
        if (!switchedPartOnPreviousKeyAction) {
          this.switchDateSegment(1);
        }
        this.switchedPartOnPreviousKeyAction = true;
      }
    }
    if (isBackspaceKey && this.options.selectPreviousSegmentOnBackspace) {
      // kendo angular have this UX
      this.switchDateSegment(-1);
    }
  }
  this.tryTriggerValueChange({
    oldValue: oldExistingDateValue,
    event: e
  });
  this.triggerInputEnd({ event: e, error: error, oldElementValue: oldElementValue, newElementValue: this.elementValue });
  if (hasCaret) {
    // a format like "F" can dynamically change the resolved format pattern based on the value, e.g.
    // "Tuesday, February 1, 2022 3:04:05 AM" becomes
    // "Wednesday, February 2, 2022 3:04:05 AM" giving a diff of 2 ("Tuesday".length - "Wednesday".length)
    this.setTextAndFormat();
  }
}

function refreshElementValue() {
  const element = this.element;
  const format = this.isActive ? this.inputFormat : this.displayFormat;
  const { text: currentText, format: currentFormat } = this.dateObject.getTextAndFormat(format);
  this.currentFormat = currentFormat;
  this.currentText = currentText;
  const hasPlaceholder = this.options.hasPlaceholder || isPresent(this.options.placeholder);
  const showPlaceholder = !this.isActive &&
    hasPlaceholder &&
    !this.dateObject.hasValue();
  if (hasPlaceholder && isPresent(this.options.placeholder)) {
    element.placeholder = this.options.placeholder;
  }
  const newElementValue = showPlaceholder ? "" : this.currentText;
  this.previousElementValue = this.elementValue;
  console.log('newElementValue', newElementValue);
  this.setElementValue(newElementValue);
};

function getTextAndFormat(customFormat = "") {
  let format = customFormat || this.format;
  let text = (this.intl.service as JalaliCldrIntlService).getDayJsValue(this.value)?.locale(this.intl.localeId)?.format(mapKendoFormatToDayJs(format as string, this.intl.service, this.value));

  const mask = this.dateFormatString(this.value, format);
  if (this.autoCorrectParts || !this._partiallyInvalidDate.startDate) {
    return this.merge(text, mask);
  }

  let partiallyInvalidText = "";
  const formattedDate = this.intl.formatDate(this.value, format, this.intl.localeId);
  const formattedDates = this.getFormattedInvalidDates(format);
  for (let i = 0; i < formattedDate.length; i++) {
    const symbol = mask.symbols[i];
    if (mask.partMap[i].type === "literal") {
      partiallyInvalidText += text[i];
    }
    else if (this.getInvalidDatePartValue(symbol)) {
      const partsForSegment = this.getPartsForSegment(mask, i);
      if (symbol === "M") {
        const datePartText = (parseToInt(this.getInvalidDatePartValue(symbol)) + JS_MONTH_OFFSET).toString();
        if (partsForSegment.length > MONTH_PART_WITH_WORDS_THRESHOLD) {
          partiallyInvalidText += formattedDates[symbol][i];
        }
        else {
          if (this.getInvalidDatePartValue(symbol)) {
            const formattedDatePart = padZero(partsForSegment.length - datePartText.length) + datePartText;
            partiallyInvalidText += formattedDatePart;
            // add -1 as the first character in the segment is at index i
            i += partsForSegment.length - 1;
          }
          else {
            partiallyInvalidText += formattedDates[symbol][i];
          }
        }
      }
      else {
        if (this.getInvalidDatePartValue(symbol)) {
          const datePartText = this.getInvalidDatePartValue(symbol).toString();
          const formattedDatePart = padZero(partsForSegment.length - datePartText.length) + datePartText;
          partiallyInvalidText += formattedDatePart;
          // add -1 as the first character in the segment is at index i
          i += partsForSegment.length - 1;
        }
        else {
          partiallyInvalidText += formattedDates[symbol][i];
        }
      }
    }
    else {
      partiallyInvalidText += text[i];
    }
  }
  text = partiallyInvalidText;
  const result = this.merge(text, mask);
  return result;
}

function dateFormatString(date, format) {
  var dateFormatParts = this.intl.splitDateFormat(format, this.intl.service.localeIdByDatePickerType);
  var parts = [];
  var partMap = [];
  for (var i = 0; i < dateFormatParts.length; i++) {
    let partLength = this.intl.service.getDayJsValue(date)?.format(dateFormatParts[i].pattern.toMomentDateTimeFormat()).length || 0;
    while (partLength > 0) {
      parts.push(this.symbols[dateFormatParts[i].pattern[0]] || Constants.formatSeparator);
      partMap.push(dateFormatParts[i]);
      partLength--;
    }
  }
  var returnValue = new Mask();
  returnValue.symbols = parts.join('');
  returnValue.partMap = partMap;
  return returnValue;
};

function mapKendoFormatToDayJs(format: string, i18n: JalaliCldrIntlService, dt: Date) {
  // if (format === 'd')
  //   format = i18n.isJalali ? 'y_M_d' : 'M_d_y';
  // else if (format === 'g')
  //   format = i18n.isJalali ? 'y_M_d h_mm_aa' : 'M_d_y h_mm_aa';
  // else if (format === 't')
  //   format = 'h:mm A';

  return convertKendoToDayjsFormat(format, i18n.localeId); // (mapFormatToDayJs(format, dt));
}

function mapFormatToDayJs(value: string, dt: Date) {
  return value.replace('h_mm_aa', 'h:mm A').replaceAll('_', '/').replaceAll('y', dt.getFullYear() < 623 ? '0' : 'YYYY').replaceAll('d', 'D').replaceAll('aa', 'a');

}
function prepareDiffInJalaliMode(intl: JalaliCldrIntlService, diff: any[]) {
  if (!intl.isJalali) { return; }

  if (!this.elementValue || !this.dateObject.hasValue()) {
    this.dateObject.date = false;
    this.dateObject.year = false;
    this.dateObject.month = false;
    this.dateObject = this.getDateObject((MIN_JALALI_DATE.clone().toDate()));
  }
  if (!this.elementValue) return;

  const dt = intl.getDayJsValue(this.dateObject.value, 'fa');
  if (!dt) return;

  // if (debuggerCounter(3)) { }

  diff.forEach((d): void => {
    if (!d[0]) return;

    if (d[0] === 'M') {

      this.dateObject.month = d[1] != '';
      if (d[1] === '') {
        existInputs.M = false;
        this.dateObject = this.getDateObject(dt.month((+d[1])).toDate());
        return;
      }
      let month = d[1];
      if (existInputs.M) {
        month = +(dt.month() + 1) + d[1];
        resetExistingInputs();
      } else {
        existInputs.M = true;
        if (month === '0') {
          existInputs.M = false;
          this.dateObject.month = false;
          this.dateObject.value = dt.month(0).toDate();
          this.dateObject.leadingZero = { [d[0]]: 1 };

          return;
        }
      }

      this.dateObject.value = (dt.set('month', month - 1).toDate());
      d[1] = '' + (dt.locale('en').month() + 1);

      return;
    }
    else if (d[0].toLocaleLowerCase() === 'd') {
      if (d[1] === '') {
        existInputs.d = false;
        this.dateObject = this.getDateObject(dt.date((+d[1])).toDate());
        return;
      }
      this.dateObject.date = true;
      let day = d[1];
      if (existInputs.d) {
        day = +(dt.date()) + d[1];
        resetExistingInputs();
      } else {
        existInputs.d = true;
        if (day === '0') {
          existInputs.d = false;
          this.dateObject.date = false;
          this.dateObject.leadingZero = { d: 1 };
          this.dateObject.value = dt.day(1).toDate();
          return;
        }
      }
      this.dateObject.value = (dt.set('date', +day).toDate());
      d[1] = '' + (dt.locale('en').date());
      return;
    }
    else if (d[0].toLocaleLowerCase() === 'y') {
      d[1] = prepareYearValue.call(this, d, dt);
    }
    else if (d[0].toLocaleLowerCase() === 'h') {
      d[1] = prepareHourValue.call(this, d, dt);
    }
    else if (d[0].toLocaleLowerCase() === 'm') {
      d[1] = prepareMinuteValue.call(this, d, dt);
    }
    else if (d[0].toLocaleLowerCase() === 's') {
      d[1] = prepareSecondValue.call(this, d, dt);
    }
  });
}
function prepareSecondValue(diff: any[], dt: dayjs.Dayjs) {
  diff[2] = false
  this.dateObject.seconds = false;
  const seconds = diff[1];
  const format = diff[0];
  if (seconds === '') {
    existInputs.s = false;
    this.dateObject = this.getDateObject(dt.second((+seconds)).toDate());
    return '';
  }
  this.dateObject.seconds = true;
  // if (!existInputs.y && year === '0') {
  //   existInputs.y = false;
  //   this.dateObject.year = false;
  //   return;
  // }
  if (!existInputs.s || dt.format(format).length > 1) {
    existInputs.s = true;
    this.dateObject = this.getDateObject(dt.second((+seconds)).toDate());
    return seconds === '' ? '' : dt.format(format);
  }

  this.dateObject.value = dt.second(+(dt.second() + seconds)).toDate();

  if (dt.format(format).length > 1) {
    resetExistingInputs();
    diff[2] = true;
  }
  return dt.format(format);
}
function prepareMinuteValue(diff: any[], dt: dayjs.Dayjs) {
  diff[2] = false
  this.dateObject.hours = false;
  const minutes = diff[1];
  const format = diff[0];
  if (minutes === '') {
    existInputs.m = false;
    this.dateObject = this.getDateObject(dt.minute((+minutes)).toDate());
    return '';
  }
  this.dateObject.hours = true;
  // if (!existInputs.y && year === '0') {
  //   existInputs.y = false;
  //   this.dateObject.year = false;
  //   return;
  // }
  if (!existInputs.m || dt.format(format).length > 1) {
    existInputs.m = true;
    this.dateObject = this.getDateObject(dt.minute((+minutes)).toDate());
    return minutes === '' ? '' : dt.format(format);
  }

  this.dateObject.value = dt.minute(+(dt.minute() + minutes)).toDate();

  if (dt.format(format).length > 1) {
    resetExistingInputs();
    diff[2] = true;
  }
  return dt.format(format);
}
function prepareHourValue(diff: any[], dt: dayjs.Dayjs) {
  diff[2] = false
  this.dateObject.hours = false;
  const hours = diff[1];
  const format = diff[0];
  if (hours === '') {
    existInputs.h = false;
    this.dateObject = this.getDateObject(dt.hour((+hours)).toDate());
    return '';
  }
  this.dateObject.hours = true;
  // if (!existInputs.y && year === '0') {
  //   existInputs.y = false;
  //   this.dateObject.year = false;
  //   return;
  // }
  if (!existInputs.h || dt.format(format).length > 1) {
    existInputs.h = true;
    this.dateObject = this.getDateObject(dt.hour((+hours)).toDate());
    return hours === '' ? '' : dt.format(format);
  }

  this.dateObject.value = dt.hour(+(dt.hour() + hours)).toDate();

  if (dt.format(format).length > 1) {
    resetExistingInputs();
    diff[2] = true;
  }
  return dt.format(format);
}
function prepareYearValue(diff: any[], dt: dayjs.Dayjs) {
  diff[2] = false
  this.dateObject.year = false;
  const year = diff[1];
  if (year === '') {
    existInputs.y = false;
    this.dateObject = this.getDateObject(dt.year((+year)).toDate());
    return '';
  }

  this.dateObject.year = true;
  // if (!existInputs.y && year === '0') {
  //   existInputs.y = false;
  //   this.dateObject.year = false;
  //   return '0';
  // }

  if (!existInputs.y || ('' + dt.year()).length > 3) {
    existInputs.y = true;
    this.dateObject = this.getDateObject(dt.year((+year) || 1).toDate());
    return year === '' ? '0' : year === '0' ? '0' : '' + dt.year();
  }

  this.dateObject.value = dt.year(+(dt.year() + year)).toDate();

  if (('' + dt.year()).length > 3) {
    resetExistingInputs();
    diff[2] = true;
  }

  return '' + dt.year();
}
function resetExistingInputs() {
  existInputs.M = false;
  existInputs.d = false;
  existInputs.y = false;
  existInputs.h = false;
  existInputs.m = false;
  existInputs.s = false;
  existInputs.a = false;
}
const existInputs = {
  M: false,
  d: false,
  y: false,
  h: false,
  m: false,
  s: false,
  a: false
};

function parsePart(diff) {
  const value = this.dateObject.value;
  const dt = this.intl.service.getDayJsValue(this.dateObject.value) as dayjs.Dayjs;
  let switchToNext = false;
  if (!diff[0]?.[0]) return {
    hasInvalidDatePart: false,
    resetPart: false,
    switchToNext: false,
    value
  };

  const target = diff[0][0].toLocaleLowerCase();
  if (diff[0][0] === 'M') {
    switchToNext = dt.month() > 0;
  } else if (target === 'd') {
    switchToNext = dt.date() > 3;
  } else if (target === 'y') {
    switchToNext = dt.year() > 1000;
  } else if (target === 'a') {
    switchToNext = true;
  } else if (diff[0][0] === 'h') {
    switchToNext = dt.hour() > 1;
  } else if (diff[0][0] === 'H') {
    switchToNext = dt.hour() > 5;
  } else if (diff[0][0] === 'm') {
    switchToNext = dt.minute() > 5;
  } else if (diff[0][0] === 's') {
    switchToNext = dt.second() > 5;
  }

  return {
    hasInvalidDatePart: false,
    resetPart: true,
    switchToNext,
    value
  };
}

function convertKendoToDayjsFormat(kendoFormat, localeId) {
  const aliasFormats = localeData(localeId).calendar.patterns;
  const kendoToDayjsMap = {
    'yyyy': 'YYYY',
    'yy': 'YY',
    'y': 'YYYY',
    'yyy': 'YYY',
    'dd': 'DD',
    'd': 'D',
    'tt': 'A',
    'fff': 'SSS' // اگر نیاز به پشتیبانی از میلیثانیه دارید,
  };

  const regexPattern = Object.keys(kendoToDayjsMap)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');

  const regex = new RegExp(regexPattern, 'g');

  return (aliasFormats[kendoFormat] || kendoFormat).replace(regex, match => kendoToDayjsMap[match]);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {};