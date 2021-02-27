import { debounceTime } from 'rxjs/operators';
import { JalaliCldrIntlService } from './../services/locale.service';
import { TemplateRef } from '@angular/core';
import { CalendarComponent, MultiViewCalendarComponent } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';

let headerTitleTemplate: TemplateRef<any>;
Object.defineProperty(CalendarComponent.prototype, 'headerTitleTemplate', {
  get(): TemplateRef<any> {
    return headerTitleTemplate || this.injector.get(IntlService).defaultTitleTemplate;
  },

  set(template: TemplateRef<any>): void {
    headerTitleTemplate = template;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MultiViewCalendarComponent.prototype, 'headerTitleTemplate', {
  get(): TemplateRef<any> {
    return headerTitleTemplate || this.bus.injector.get(IntlService).defaultTitleTemplate;
  },

  set(template: TemplateRef<any>): void {
    headerTitleTemplate = template;
  },
  enumerable: true,
  configurable: true
});

const oldNgOnInit = CalendarComponent.prototype['ngOnInit'];
CalendarComponent.prototype['ngOnInit'] = function (): void {
  const me: CalendarComponent = this;
  oldNgOnInit.call(this);
  const intl: JalaliCldrIntlService = this.bus.service(this.activeViewEnum).intlService;
  intl.$calendarType.pipe(debounceTime(100)).subscribe(x => {
    this.onResize();
  })
}
