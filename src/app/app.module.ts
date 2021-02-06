import { LOCALE_ID, NgModule, Injectable } from '@angular/core';
import '@angular/localize/init';
import { BrowserModule } from '@angular/platform-browser';
import { KendoJalaliDatePickerModule } from '@progress/kendo-jalali-date-picker';
import { AppComponent } from './app.component';
import '@progress/kendo-angular-intl/locales/fa/all';
import '@progress/kendo-angular-intl/locales/tr/all';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KendoJalaliDatePickerModule
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: 'fa-IR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
