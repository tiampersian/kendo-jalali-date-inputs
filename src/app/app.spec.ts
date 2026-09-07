import { TestBed } from '@angular/core/testing';
import { App } from './app';
import dayjs from 'dayjs';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DatePickerType } from '@tiampersian/kendo-jalali-date-inputs';
import { LOCALE_ID } from '@angular/core';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideNoopAnimations(),
        { provide: LOCALE_ID, useValue: 'fa-IR' },
      ]
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  const testCases = [
    { input: '2020-03-20T20:30:00.000Z' },
    { input: '2020-03-20T20:15:00.000Z' },
    { input: '2020-03-20T21:15:00.000Z' },
    { input: '2020-10-20T21:15:00.000Z' },
    { input: '2017-03-20T20:15:00.000Z' },
    { input: '2017-03-21T20:45:00.000Z' },
    { input: '2017-10-21T20:45:00.000Z' },
    { input: '2017-03-21T20:30:00.000Z' },
    { input: '2020-09-20T20:29:59.000Z' },
    { input: '2020-09-20T18:30:00.000Z' },
    { input: '2020-03-08T08:00:00.000Z' },
    { input: '2020-03-08T08:15:00.000Z' },
    { input: '2020-03-08T07:45:00.000Z' },
    { input: '2020-10-08T07:00:00.000Z' },
    { input: '2019-03-10T08:15:00.000Z' },
    { input: '2019-03-10T07:45:00.000Z' },
    { input: '2019-10-10T07:00:00.000Z' },
    { input: '2019-03-10T08:00:00.000Z' },
    { input: '2018-03-11T08:00:00.000Z' },
    { input: '2018-03-11T08:15:00.000Z' },
    { input: '2018-03-10T07:45:00.000Z' },
    { input: '2018-10-11T07:00:00.000Z' },
    { input: '2020-11-01T07:00:00.000Z' },
    { input: '2020-11-01T07:59:59.000Z' }
  ];

  (testCases.slice(0, 1)).forEach(item => {
    it(`should have as proper value date input in jalali mode with ${item.input} value`, async () => {
      // arrange
      const fixture = TestBed.createComponent(App);
      fixture.componentInstance.value = new Date(item.input);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const dataPicker = fixture.debugElement.query(By.css('kendo-datepicker'));
      const input = (dataPicker.nativeElement as HTMLElement).querySelector('input');

      // action
      fixture.detectChanges();

      // expected
      expect(fixture.componentInstance.calendarType).toBe(DatePickerType.jalali);
      expect(input.value).toBe(dayjs(item.input).calendar('jalali').locale('fa').format('YYYY/M/D'));
    });
  });
  ([
    {
      input: '2025-07-26T00:00:00.000Z', expected: '١٤٠٤/٥/٤'
    }
  ]).forEach(item => {

    it(`should have as proper value date input in jalali mode with ${item.input} value`, async () => {
      // arrange
      const fixture = TestBed.createComponent(App);
      fixture.componentInstance.value = new Date(item.input);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const dataPicker = fixture.debugElement.query(By.css('kendo-datepicker'));
      const input = (dataPicker.nativeElement as HTMLElement).querySelector('input');

      // action
      fixture.detectChanges();

      // expected
      expect(fixture.componentInstance.calendarType).toBe(DatePickerType.jalali);
      expect(input.value).toBe(item.expected);
    });
  });

  it.skip(`should have as proper value date input in jalali mode with 2020-03-20T20:30:00.000Z value`, async () => {
    // arrange
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.value = new Date('2020-03-20T20:30:00.000Z');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const dataPicker = fixture.debugElement.query(By.css('kendo-datepicker'));
    const input = fixture.debugElement.query(By.css('kendo-datepicker input'));
    input.nativeElement.selectionStart = 5;
    input.nativeElement.selectionEnd = 6;
    fixture.detectChanges();
    input.nativeElement.focus();
    input.nativeElement.value/*?*/;
    input.nativeElement.value = '١٣٩٩/٢/٢';
    input.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: '2', shiftKey: true }),
    );
    input.triggerEventHandler('change', {});
    fixture.detectChanges();
    await fixture.whenStable();

    // action
    fixture.detectChanges();

    // expected
    expect(dayjs(fixture.componentInstance.value).locale('fa').format('YYYY/M/D')).toEqual('١٣٩٩/٢/٢');
    // expect(input.nativeElement.value/*?*/).not.toBe(dayjs(testCases[0].input).locale('fa').format('YYYY/M/D'));
  });
});
