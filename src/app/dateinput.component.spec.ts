import { fakeAsync } from '@angular/core/testing';
import { DatePickerType } from '@tiampersian/kendo-jalali-date-inputs';
import dayjs from 'dayjs';
import { DateInputComponentPage } from './dateinput.component.spec.page';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/fa';
dayjs.extend(isBetween);
dayjs.extend(localeData);

describe('SUT(integration): DateInputComponent', () => {
  let sutPage: DateInputComponentPage;
  const some_value = new Date('2020/11/01');
  const expected_value_jalali = dayjs(some_value).calendar('jalali').locale('fa').format('M/D/YYYY')/*?*/;
  const expected_value_gregorian = dayjs(some_value).locale('en').format('M/D/YYYY')/*?*/;

  beforeEach(async () => {
    sutPage = await new DateInputComponentPage().init();
  });

  afterEach(() => {
    sutPage.fixture.destroy();
    sutPage.fixture.destroy();
  })

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
    /*1*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('5/D/YYYY'), 1]
      ], scenario: 'month (1 digit)'
    },
    /*2*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('1/D/YYYY'), 1], [dayjs(some_value).calendar('jalali').locale('fa').format('11/D/YYYY'), 2]
      ], scenario: 'month (2 digit)'
    },
    /*3*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('0/D/YYYY'), 1], [dayjs(some_value).calendar('jalali').locale('fa').format('4/D/YYYY'), 1]
      ], scenario: 'month (1 digit and start with zero)'
    },
    /*4*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('1/D/YYYY'), 1], [dayjs(some_value).calendar('jalali').locale('fa').format('10/D/YYYY'), 2]
      ], scenario: 'month (2 digit and end with zero)'
    },
    /*5*/{ case: [[dayjs(some_value).calendar('jalali').locale('fa').format('M/3/YYYY'), 3]], scenario: 'day (1 digit)' },
    /*6*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/1/YYYY'), 3], [dayjs(some_value).calendar('jalali').locale('fa').format('M/12/YYYY'), 4]
      ], scenario: 'day (2 digit)'
    },
    /*7*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/0/YYYY'), 3], [dayjs(some_value).calendar('jalali').locale('fa').format('M/1/YYYY'), 3]
      ], scenario: 'day (1 digit and start with zero)'
    },
    /*8*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/1/YYYY'), 3], [dayjs(some_value).calendar('jalali').locale('fa').format('M/10/YYYY'), 4]
      ], scenario: 'day (2 digit and end with zero)'
    },

    /*9*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/1'), 6, 10], [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/13'), 7, 10],
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/138'), 8, 10], [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/1388'), 9, 10]
      ], scenario: 'year (4 digit)'
    },
    /*10*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/1'), 6], [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/13'), 7],
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/138'), 8], [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/1388'), 9]
      ], scenario: 'year (3 digit and start with zero)'
    },
    /*11*/{
      case: [
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/1'), 6],
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/10'), 7],
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/100'), 8],
        [dayjs(some_value).calendar('jalali').locale('fa').format('M/D/1008'), 9]
      ], scenario: ''
    },
  ] as { case: [string, number][], scenario: string }[]).forEach((testCase, i: number) => {
    xit(`should set proper value and show proper value when input value has change in #${i + 1}: ${(testCase.scenario)}`, async () => {
      // arrange
      await sutPage.with_payloadValue(some_value).detectChanges().whenRenderingDone();
      await sutPage.with_send_inputValue(testCase.case);

      // assert
      const expectedInputValue = testCase.case.slice(-1)[0][0];
      const expectedValue = getJalaliValue(expectedInputValue);
      expect(sutPage.component.value.toISOString()).toEqual(expectedValue);
      expect(sutPage.component.inputValue.toPerNumber()).toEqual(expectedInputValue.toPerNumber());
      if (sutPage.component.inputValue.toPerNumber() !== expectedInputValue.toPerNumber()) {
      }

    });
  });
  // current input value 11/2/2020

  ([
    { case: [[dayjs(some_value).format('5/D/YYYY'), 1]], scenario: 'month (1 digit)' },
    { case: [[dayjs(some_value).format('1/D/YYYY'), 1], [dayjs(some_value).format('11/D/YYYY'), 2]], scenario: 'month (2 digit)' },
    { case: [[dayjs(some_value).format('0/D/YYYY'), 1], [dayjs(some_value).format('4/D/YYYY'), 1]], scenario: 'month (1 digit and start with zero)' },
    { case: [[dayjs(some_value).format('1/D/YYYY'), 1], [dayjs(some_value).format('10/D/YYYY'), 2]], scenario: 'month (2 digit and end with zero)' },

    { case: [[dayjs(some_value).format('M/2/YYYY'), 4]], scenario: 'day (1 digit)' },
    { case: [[dayjs(some_value).format('M/1/YYYY'), 4], [dayjs(some_value).format('M/12/YYYY'), 5]], scenario: 'day (2 digit)' },
    { case: [[dayjs(some_value).format('M/0/YYYY'), 4], [dayjs(some_value).format('M/1/YYYY'), 4]], scenario: 'day (1 digit and start with zero)' },
    { case: [[dayjs(some_value).format('M/1/YYYY'), 4], [dayjs(some_value).format('M/10/YYYY'), 5]], scenario: 'day (2 digit and end with zero)' },
    {
      case: [
        [dayjs(some_value).format('M/D/2'), 6], [dayjs(some_value).format('M/D/20'), 7]
        , [dayjs(some_value).format('M/D/203'), 8], [dayjs(some_value).format('M/D/2031'), 9]
      ], scenario: 'year (4 digit)'
    },
    {
      case: [
        [dayjs(some_value).format('M/D/1'), 6], [dayjs(some_value).format('M/D/13'), 7],
        [dayjs(some_value).format('M/D/138'), 8], [dayjs(some_value).format('M/D/1388'), 9]
      ], scenario: 'year (3 digit and start with zero)'
    },
    {
      case: [
        [dayjs(some_value).format('M/D/1'), 6], [dayjs(some_value).format('M/D/10'), 7],
        [dayjs(some_value).format('M/D/100'), 8], [dayjs(some_value).format('M/D/1008'), 9]
      ], scenario: ''
    },
  ] as { case: [string, number][], scenario: string }[]).forEach((testCase, i: number) => {
    it(`should set proper value and show proper value when input value has change in #${i + 1}: ${(testCase.scenario)}`, async () => {

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
  try {
    if (dayjs(value).isValid()) {
      return dayjs(dayjs(value).format('YYYY/M/D'), { jalali: true } as any).toDate().toISOString();
    }
    return dayjs(value, 'YYYY/M/D', { jalali: true } as any).toDate().toISOString();

  } catch (error) {
    console.log(error)
  }
  return dayjs().toDate().toISOString();
}
function getGregorianValue(value: string) {
  return dayjs(value, 'M/D/YYYY', 'en').toDate().toISOString();
}

