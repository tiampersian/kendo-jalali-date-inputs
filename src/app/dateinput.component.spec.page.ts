import { interval, Subject } from 'rxjs';
import { DatePickerType } from 'projects/tiampersian/kendo-jalali-date-inputs/src/lib/models/date-picker-type';
import { DateInputComponent } from '@progress/kendo-angular-dateinputs';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import { JalaliCldrIntlService, KendoJalaliDateInputsModule } from '@tiampersian/kendo-jalali-date-inputs';

export class DateInputComponentPage {
  fixture: ComponentFixture<DateInputComponent>;
  component: DateInputComponent;
  localeId = 'fa-IR';
  intl: JalaliCldrIntlService;
  constructor() {
  }

  with_en_localeId() {
    this.intl.changeLocaleId('en-US');
    return this;
  }

  with_fa_localeId() {
    this.intl.changeLocaleId('fa-IR');
    return this;
  }

  with_payloadValue(value) {
    this.component.writeValue(value);
    return this;
  }

  async init() {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BrowserModule,
        KendoJalaliDateInputsModule
      ],
      providers: [
        { provide: LOCALE_ID, useValue: this.localeId },
      ]
    }).compileComponents();
    this.fixture = TestBed.createComponent(DateInputComponent);
    this.component = this.fixture.componentInstance;
    this.component.format = 'M/d/yyyy';
    this.intl = (this.component as any).intl as JalaliCldrIntlService;
    this.with_en_localeId();
    this.with_jalali_mode();
    return this;
  }

  with_jalali_mode() {
    this.intl.changeType(DatePickerType.jalali);
    return this;
  }
  with_gregorian_mode() {
    this.intl.changeType(DatePickerType.gregory);
    return this;
  }

  with_selection(start, end) {
    this.inputElement.setSelectionRange(start, end);
    return this;
  }

  with_send_inputValue(items: [string, number][]) {
    console.log(this.inputElement.selectionStart);
    console.log(this.component.format);

    items.forEach((item, index) => {
      this.inputElement.value = item[0];
      console.log(this.inputElement.value);
      this.with_selection(item[1], item[1]);
      (this.component as any).handleInput();
      console.log(this.inputElement.value);
    });
    console.log(this.inputElement.selectionStart);
    this.component.blur();

    return this.detectChanges().whenStable();
  }

  private get inputElement(): HTMLInputElement {
    return this.component.inputElement;
  }

  detectChanges() {
    this.fixture.detectChanges();
    return this.fixture;
  }
}
