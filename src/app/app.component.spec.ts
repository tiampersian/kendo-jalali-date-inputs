import { LOCALE_ID } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerType, KendoJalaliDateInputsModule } from '@tiampersian/kendo-jalali-date-inputs';
import moment from 'dayjs';
import { AppComponent } from './app.component';
import '@progress/kendo-angular-intl/locales/fa/all';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
function keyPress(key) {
  return new KeyboardEvent("keypress", {
    "key": key
  });
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BrowserModule,
        DateInputsModule,
        KendoJalaliDateInputsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'fa-IR' },
      ]
    }).compileComponents();
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
  ].slice(0, 1);
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  (testCases.slice(0, 1)).forEach(item => {
    it(`should have as proper value date input in jalali mode with ${item.input} value`, async () => {
      // arrange
      const fixture = TestBed.createComponent(AppComponent);
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
      expect(input.value).toBe(moment(item.input).calendar('jalali').locale('fa').format('YYYY/M/D'));
    });
  });

  xit(`should have as proper value date input in jalali mode with 2020-03-20T20:30:00.000Z value`, async () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
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
    input.triggerEventHandler('change', {})
    fixture.detectChanges();
    await fixture.whenStable();

    // action
    fixture.detectChanges();

    // expected
    expect(moment(fixture.componentInstance.value).locale('fa').format('YYYY/M/D')).toEqual('١٣٩٩/٢/٢')
    // expect(input.nativeElement.value/*?*/).not.toBe(moment(testCases[0].input).locale('fa').format('YYYY/M/D'));
  });
});
