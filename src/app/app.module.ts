import { LOCALE_ID, NgModule, Injectable } from '@angular/core';
import '@angular/localize/init';
import { BrowserModule } from '@angular/platform-browser';
import { KendoJalaliDatePickerModule } from '@progress/kendo-jalali-date-picker';
import { AppComponent } from './app.component';
import '@progress/kendo-angular-intl/locales/fa/all';
import '@progress/kendo-angular-intl/locales/tr/all';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    KendoJalaliDatePickerModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
