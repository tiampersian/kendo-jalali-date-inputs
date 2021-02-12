import { LOCALE_ID, NgModule, Injectable, SkipSelf } from '@angular/core';
import '@angular/localize/init';
import { BrowserModule } from '@angular/platform-browser';
import { JalaliCldrIntlService, KendoJalaliDatePickerModule } from '@progress/kendo-jalali-date-picker';
import { AppComponent } from './app.component';
import '@progress/kendo-angular-intl/locales/fa/all';
import '@progress/kendo-angular-intl/locales/tr/all';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlService } from '@progress/kendo-angular-intl';
import { RTL } from '@progress/kendo-angular-l10n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    KendoJalaliDatePickerModule
  ],
  providers: [
    { provide: LOCALE_ID, useFactory: originalLocaleIdFactory },
    { provide: RTL, useFactory: isRtl, deps: [] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function originalLocaleIdFactory(originalLocalId: string): string {
  return localStorage.getItem('localeId') || originalLocalId;
}

export function isRtl(): boolean {
  return localStorage.getItem('localeId') === 'fa-IR';
}
