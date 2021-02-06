import { ChangeDetectorRef, Component, Inject, LOCALE_ID, Injector } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { JalaliCldrIntlService } from '@progress/kendo-jalali-date-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  viewProviders: [
  ],

})
export class AppComponent {
  title = 'kendo-jalali-datepicker';
  public value: Date = new Date();
  rerender = true;
  locales = ['en-US', 'fa'];
  locale = '';
  constructor(
    private localeService: IntlService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {
    this.locale = (localeService as JalaliCldrIntlService).localeId;
  }

  changeLocale(value) {
    localStorage.setItem('locale', value);
    // location.reload()
    (this.localeService as JalaliCldrIntlService).localeId = value;
    this.rerender = false;

    this.cdr.detectChanges();
    this.rerender = true;

  }
}
