import { TemplateRef } from '@angular/core';
import { CalendarComponent, MultiViewCalendarComponent } from '@progress/kendo-angular-dateinputs';
import { debounceTime } from 'rxjs/operators';
import { services } from '../providers';
import { JalaliCldrIntlService } from '../services/jalali-cldr-intl.service';
import { dateInRange, firstDayOfMonth, getDayJsValue } from '../services/kendo-util-overrides';

let headerTitleTemplate: TemplateRef<any>;
Object.defineProperty(CalendarComponent.prototype, 'headerTitleTemplate', {
  get(): TemplateRef<any> {
    return headerTitleTemplate || JalaliCldrIntlService.staticDefaultTitleTemplate;
  },

  set(template: TemplateRef<any>): void {
    headerTitleTemplate = template;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(MultiViewCalendarComponent.prototype, 'headerTitleTemplate', {
  get(): TemplateRef<any> {
    return headerTitleTemplate || JalaliCldrIntlService.staticDefaultTitleTemplate;
  },

  set(template: TemplateRef<any>): void {
    headerTitleTemplate = template;
  },
  enumerable: true,
  configurable: true
});

let bus;
Object.defineProperty(MultiViewCalendarComponent.prototype, 'bus', {
  get(): any {
    return bus;
  },

  set(value: any): void {
    bus = value;
    bus.service = (view) => {
      return this.bus.injector.get(services[view]) as any;
    }
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(CalendarComponent.prototype, 'bus', {
  get(): any {
    return bus;
  },

  set(value: any): void {
    bus = value;
    bus.service = (view) => {
      return this.bus.injector.get(services[view]) as any;
    }
  },
  enumerable: true,
  configurable: true
});

const oldNgOnInit = CalendarComponent.prototype.ngOnInit;
CalendarComponent.prototype.ngOnInit = function (): void {
  const me: CalendarComponent = this;
  oldNgOnInit.call(this);
  const intl: JalaliCldrIntlService = this.bus.service(this.activeViewEnum).intl;
  intl.$calendarType.pipe(debounceTime(10)).subscribe(x => {
    me.onResize();
    this.cdr.detectChanges();
  });
};
const oldNgOnInit1 = MultiViewCalendarComponent.prototype.ngOnInit;
MultiViewCalendarComponent.prototype.ngOnInit = function (): void {
  const me: MultiViewCalendarComponent = this;
  oldNgOnInit1.call(this);
  const intl: JalaliCldrIntlService = this.bus.service(this.activeViewEnum).intl;
  intl.$calendarType.pipe(debounceTime(100)).subscribe(x => {
    me.navigateView(6);
    this.cdr.detectChanges();
  });
};

CalendarComponent.prototype.handleNavigation = function (candidate: Date) {
  if (this.disabled) {
    return;
  }
  const focusTarget = candidate ? firstDayOfMonth(candidate, this.bus.service(0).intl.localeIdByDatePickerType) : this.focusedDate;
  this.focusedDate = dateInRange(focusTarget, this.min, this.max);
  this.detectChanges();
}