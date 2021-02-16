import { LOCALE_ID } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerType, KendoJalaliDatePickerModule } from '@progress/kendo-jalali-date-picker';
import moment from 'jalali-moment';
import { AppComponent } from './app.component';
import '@progress/kendo-angular-intl/locales/fa/all';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BrowserModule,
        FormsModule,
        KendoJalaliDatePickerModule],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'fa-IR' },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  ([
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
  ]).forEach(item => {
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
      expect(input.value).toBe(moment(item.input).locale('fa').format('DD/MM/YYYY'));
    });
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('kendo-jalali-date app is running!');
  // });
});
