import { fakeAsync } from '@angular/core/testing';
import { DatePickerType } from '@tiampersian/kendo-jalali-date-inputs';
import moment from 'jalali-moment';
import { DateInputComponentPage } from "./dateinput.component.spec.page";

fdescribe('SUT(integration): DateInputComponent', () => {
  let sutPage: DateInputComponentPage;
  const some_value = new Date('2020-11-01T20:30:00.000Z');
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

    expect(sutPage.component.inputValue).toEqual(expected_value_jalali/*?*/);
    expect(sutPage.component.value.toISOString()).toEqual(some_value.toISOString()/*?*/);
  });

  it(`should set proper value when writeValue called with proper value`, async () => {

    // arrange
    sutPage.with_gregorian_mode().with_payloadValue(some_value).detectChanges();

    // assert
    expect(sutPage.component.inputValue).toEqual(expected_value_gregorian);
  });
  // current input value 8/12/1399
  ([
    { case: [['5/12/1399', 1]], scenario: 'month (1 digit)' },
    { case: [['1/12/1399', 1], ['11/12/1399', 2]], scenario: 'month (2 digit)' },
    { case: [['0/12/1399', 1], ['4/12/1399', 1]], scenario: 'month (1 digit and start with zero)' },
    { case: [['1/12/1399', 1], ['10/12/1399', 2]], scenario: 'month (2 digit and end with zero)' },

    { case: [['8/3/1399', 3]], scenario: 'day (1 digit)' },
    { case: [['8/1/1399', 3], ['8/12/1399', 4]], scenario: 'day (2 digit)' },
    { case: [['8/0/1399', 3], ['8/1/1399', 3]], scenario: 'day (1 digit and start with zero)' },
    { case: [['8/1/1399', 3], ['8/10/1399', 4]], scenario: 'day (2 digit and end with zero)' },

    { case: [['8/12/1', 6], ['8/12/13', 7], ['8/12/138', 8], ['8/12/1388', 9]], scenario: 'year (4 digit)' },
    { case: [['8/12/0', 6], ['8/12/03', 7], ['8/12/038', 8], ['8/12/0388', 9]], scenario: 'year (3 digit and start with zero)' },
    { case: [['8/12/0', 6], ['8/12/00', 7], ['8/12/000', 8], ['8/12/0008', 9]], scenario: '' },
  ] as { case: [string, number][], scenario: string }[]).forEach((testCase) => {
    it(`should set proper value and show proper value when input value has change in ${(testCase.scenario)}`, async () => {

      // arrange
      await sutPage.with_payloadValue(some_value).detectChanges().whenStable();
      await sutPage.with_send_inputValue(testCase.case);

      // assert
      const expected_inputValue = testCase.case[testCase.case.length - 1][0];
      const expectedValue = getJalaliValue(expected_inputValue);
      expect(sutPage.component.value.toISOString()).toEqual(expectedValue);
      expect(sutPage.component.inputValue).toEqual(expected_inputValue);
    });
  });
  // current input value 11/2/2020

  ([
    { case: [['5/2/2020', 1]], scenario: 'month (1 digit)' },
    { case: [['1/2/2020', 1], ['11/2/2020', 2]], scenario: 'month (2 digit)' },
    { case: [['0/2/2020', 1], ['4/2/2020', 1]], scenario: 'month (1 digit and start with zero)' },
    { case: [['1/2/2020', 1], ['10/2/2020', 2]], scenario: 'month (2 digit and end with zero)' },

    { case: [['11/3/2020', 4]], scenario: 'day (1 digit)' },
    { case: [['11/1/2020', 4], ['11/12/2020', 5]], scenario: 'day (2 digit)' },
    { case: [['11/0/2020', 4], ['11/1/2020', 4]], scenario: 'day (1 digit and start with zero)' },
    { case: [['11/1/2020', 4], ['11/10/2020', 5]], scenario: 'day (2 digit and end with zero)' },

    { case: [['11/2/2', 6], ['11/2/20', 7], ['11/2/203', 8], ['11/2/2031', 9]], scenario: 'year (4 digit)' },
    { case: [['11/2/0', 6], ['11/2/03', 7], ['11/2/038', 8], ['11/2/0388', 9]], scenario: 'year (3 digit and start with zero)' },
    { case: [['11/2/0', 6], ['11/2/00', 7], ['11/2/000', 8], ['11/2/0008', 9]], scenario: '' },
  ] as { case: [string, number][], scenario: string }[]).forEach((testCase) => {
    it(`should set proper value and show proper value when input value has change in ${(testCase.scenario)}`, async () => {

      // arrange
      await sutPage.with_gregorian_mode().with_payloadValue(some_value).detectChanges().whenStable();
      await sutPage.with_send_inputValue(testCase.case);

      // assert
      const expected_inputValue = testCase.case[testCase.case.length - 1][0];
      const expectedValue = getGregorianValue(expected_inputValue);
      expect(sutPage.component.value.toISOString()).toEqual(expectedValue);
      expect(sutPage.component.inputValue).toEqual(expected_inputValue);
    });
  });
});
function getJalaliValue(value: string) {
  return moment.from(value, 'fa', 'M/D/YYYY').toDate().toISOString();
}
function getGregorianValue(value: string) {
  return moment.from(value, 'en', 'M/D/YYYY').toDate().toISOString();
}

