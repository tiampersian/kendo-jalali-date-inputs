import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import '@angular/localize/init';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RTL } from '@progress/kendo-angular-l10n';
import { KendoJalaliDateInputsModule } from '@tiampersian/kendo-jalali-date-inputs';
import { AppComponent } from './app.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    KendoJalaliDateInputsModule,
    DateInputsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useFactory: originalLocaleIdFactory },
    { provide: RTL, useFactory: isRtl, deps: [] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function originalLocaleIdFactory(originalLocalId: string): string {
  return localStorage.getItem('localeId') || 'fa-IR';
}

export function isRtl(): boolean {
  return localStorage.getItem('localeId')?.startsWith('fa');
}
