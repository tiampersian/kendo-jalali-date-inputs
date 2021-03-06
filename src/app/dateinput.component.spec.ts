import { fakeAsync } from '@angular/core/testing';
import { DatePickerType } from '@tiampersian/kendo-jalali-date-inputs';
import moment from 'jalali-moment';
import { DateInputComponentPage } from './dateinput.component.spec.page';

describe('SUT(integration): DateInputComponent', () => {
  let sutPage: DateInputComponentPage;
  const some_value = new Date('2020/11/01');
  const expected_value_jalali = moment(some_value).locale('fa').format('M/D/yyyy')/*?*/;
  const expected_value_gregorian = moment(some_value).locale('en').format('M/D/yyyy')/*?*/;

  beforeEach(async () => {
    sutPage = await (await new DateInputComponentPage().init());
  });

  afterEach(() => {
    sutPage.fixture.destroy();
  });

  it(`should create properly`, () => {
    // assert
    expect(sutPage).toBeTruthy();
    expect(sutPage.intl.localeId).toEqual('en-US');
    expect(sutPage.intl.datePickerType).toEqual(DatePickerType.jalali);
  });

  it(`should set proper value when writeValue called with proper value`, async () => {

    // arrange
    await sutPage.with_payloadValue(some_value).detectChanges().whenStable();

    // assert

    expect(sutPage.component.inputValue.toPerNumber()).toEqual(expected_value_jalali.toPerNumber()/*?*/);
    expect(sutPage.component.value.toISOString()).toEqual(some_value.toISOString()/*?*/);
  });

  it(`should set proper value when writeValue called with proper value`, async () => {

    // arrange
    sutPage.with_gregorian_mode().with_payloadValue(some_value).detectChanges();

    // assert
    expect(sutPage.component.inputValue.toPerNumber()).toEqual(expected_value_gregorian.toPerNumber());
  });
  // current input value 8/12/1399
  ([
    {
      case: [
        [moment(some_value).locale('fa').format('5/D/YYYY'), 1]
      ], scenario: 'month (1 digit)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('1/D/YYYY'), 1], [moment(some_value).locale('fa').format('11/D/YYYY'), 2]
      ], scenario: 'month (2 digit)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('0/D/YYYY'), 1], [moment(some_value).locale('fa').format('4/D/YYYY'), 1]
      ], scenario: 'month (1 digit and start with zero)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('1/D/YYYY'), 1], [moment(some_value).locale('fa').format('10/D/YYYY'), 2]
      ], scenario: 'month (2 digit and end with zero)'
    },

    { case: [[moment(some_value).locale('fa').format('M/3/YYYY'), 3]], scenario: 'day (1 digit)' },
    {
      case: [
        [moment(some_value).locale('fa').format('M/1/YYYY'), 3], [moment(some_value).locale('fa').format('M/12/YYYY'), 4]
      ], scenario: 'day (2 digit)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('M/0/YYYY'), 3], [moment(some_value).locale('fa').format('M/1/YYYY'), 3]
      ], scenario: 'day (1 digit and start with zero)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('M/1/YYYY'), 3], [moment(some_value).locale('fa').format('M/10/YYYY'), 4]
      ], scenario: 'day (2 digit and end with zero)'
    },

    {
      case: [
        [moment(some_value).locale('fa').format('M/D/1'), 6], [moment(some_value).locale('fa').format('M/D/13'), 7],
        [moment(some_value).locale('fa').format('M/D/138'), 8], [moment(some_value).locale('fa').format('M/D/1388'), 9]
      ], scenario: 'year (4 digit)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('M/D/0'), 6], [moment(some_value).locale('fa').format('M/D/03'), 7],
        [moment(some_value).locale('fa').format('M/D/038'), 8], [moment(some_value).locale('fa').format('M/D/0388'), 9]
      ], scenario: 'year (3 digit and start with zero)'
    },
    {
      case: [
        [moment(some_value).locale('fa').format('M/D/0'), 6], [moment(some_value).locale('fa').format('M/D/00'), 7],
        [moment(some_value).locale('fa').format('M/D/000'), 8], [moment(some_value).locale('fa').format('M/D/0008'), 9]
      ], scenario: ''
    },
  ] as { case: [string, number][], scenario: string }[]).forEach((testCase) => {
    it(`should set proper value and show proper value when input value has change in ${(testCase.scenario)}`, async () => {

      // arrange
      await sutPage.with_payloadValue(some_value).detectChanges().whenStable();
      await sutPage.with_send_inputValue(testCase.case);

      // assert
      const expectedInputValue = testCase.case[testCase.case.length - 1][0];
      const expectedValue = getJalaliValue(expectedInputValue);
      expect(sutPage.component.value.toISOString()).toEqual(expectedValue);
      expect(sutPage.component.inputValue.toPerNumber()).toEqual(expectedInputValue.toPerNumber());
    });
  });
  // current input value 11/2/2020

  ([
    { case: [[moment(some_value).format('5/D/YYYY'), 1]], scenario: 'month (1 digit)' },
    { case: [[moment(some_value).format('1/D/YYYY'), 1], [moment(some_value).format('11/D/YYYY'), 2]], scenario: 'month (2 digit)' },
    { case: [[moment(some_value).format('0/D/YYYY'), 1], [moment(some_value).format('4/D/YYYY'), 1]], scenario: 'month (1 digit and start with zero)' },
    { case: [[moment(some_value).format('1/D/YYYY'), 1], [moment(some_value).format('10/D/YYYY'), 2]], scenario: 'month (2 digit and end with zero)' },

    { case: [[moment(some_value).format('M/3/YYYY'), 4]], scenario: 'day (1 digit)' },
    { case: [[moment(some_value).format('M/1/YYYY'), 4], [moment(some_value).format('M/12/YYYY'), 5]], scenario: 'day (2 digit)' },
    { case: [[moment(some_value).format('M/0/YYYY'), 4], [moment(some_value).format('M/1/YYYY'), 4]], scenario: 'day (1 digit and start with zero)' },
    { case: [[moment(some_value).format('M/1/YYYY'), 4], [moment(some_value).format('M/10/YYYY'), 5]], scenario: 'day (2 digit and end with zero)' },

    {
      case: [
        [moment(some_value).format('M/D/2'), 6], [moment(some_value).format('M/D/20'), 7]
        , [moment(some_value).format('M/D/203'), 8], [moment(some_value).format('M/D/2031'), 9]
      ], scenario: 'year (4 digit)'
    },
    {
      case: [
        [moment(some_value).format('M/D/0'), 6], [moment(some_value).format('M/D/03'), 7],
        [moment(some_value).format('M/D/038'), 8], [moment(some_value).format('M/D/0388'), 9]
      ], scenario: 'year (3 digit and start with zero)'
    },
    {
      case: [
        [moment(some_value).format('M/D/0'), 6], [moment(some_value).format('M/D/00'), 7],
        [moment(some_value).format('M/D/000'), 8], [moment(some_value).format('M/D/0008'), 9]
      ], scenario: ''
    },
  ] as { case: [string, number][], scenario: string }[]).forEach((testCase) => {
    it(`should set proper value and show proper value when input value has change in ${(testCase.scenario)}`, async () => {

      // arrange
      await sutPage.with_gregorian_mode().with_payloadValue(some_value).detectChanges().whenStable();
      await sutPage.with_send_inputValue(testCase.case);

      // assert
      const expectedInputValue = testCase.case[testCase.case.length - 1][0];
      const expectedValue = getGregorianValue(expectedInputValue);
      expect(sutPage.component.value.toISOString()).toEqual(expectedValue);
      expect(sutPage.component.inputValue.toPerNumber()).toEqual(expectedInputValue.toPerNumber());
    });
  });
});
function getJalaliValue(value: string) {
  return moment.from(value, 'fa', 'M/D/YYYY').toDate().toISOString();
}
function getGregorianValue(value: string) {
  return moment.from(value, 'en', 'M/D/YYYY').toDate().toISOString();
}

