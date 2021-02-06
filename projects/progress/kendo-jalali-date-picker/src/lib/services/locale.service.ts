import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';


@Injectable()
export class JalaliCldrIntlService extends CldrIntlService {

  constructor(
  ) {
    super(localStorage.getItem('locale'));
  }
}
