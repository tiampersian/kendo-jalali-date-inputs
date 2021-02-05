import { KendoJalaliDatePickerModule } from '@progress/kendo-jalali-date-picker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import '@angular/localize/init';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KendoJalaliDatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
