import { ChangeDetectorRef, Directive, Inject, Self, SkipSelf, TemplateRef, ViewContainerRef } from '@angular/core';
import { NavigationComponent } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';
import { debounceTime } from 'rxjs/operators';
import { Providers, services } from '../providers';
import { JalaliCldrIntlService } from '../services/jalali-cldr-intl.service';

// tslint:disable-next-line:no-string-literal
NavigationComponent.prototype['intlChange'] = function (): void {
  this.cdr.markForCheck();
};

@Directive({
  selector: 'kendo-datepicker,kendo-datetimepicker,kendo-calendar,kendo-timepicker,kendo-multiviewcalendar,kendo-dateinput',
  providers: [
    ...Providers
  ],
  standalone: false
})
export class KendoDatePickerDirective {
  hostComponent: any;

  constructor(
    @Inject('HeaderTitleTemplate') private headerTitleTemplate: TemplateRef<any>,
    @Inject(IntlService) @Self() private intl: JalaliCldrIntlService,
    @Inject(IntlService) @SkipSelf() hostIntlService: JalaliCldrIntlService,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.setHostComponent();
    hostIntlService.changes.pipe(debounceTime(30)).subscribe(x => {
      intl.changeLocaleId(hostIntlService.localeId);
      intl.changeType(hostIntlService.datePickerType);
      this.cdr.detectChanges();
    });
  }


  private setHostComponent() {
    this.hostComponent = this.viewContainerRef['_hostLView'].find(x => (x?.element || x?.wrapper)?.nativeElement === this.viewContainerRef.element.nativeElement);
    if (!this.hostComponent) {
      debugger
    }
    this.init();
  }

  init(hostComponent = this.hostComponent) {
    this.setBusService(hostComponent);
    this.setHeaderTitleTemplate(hostComponent);
    this.initCalendar(hostComponent);
    this.initDateInput(hostComponent);
    this.initDatePicker(hostComponent);
  }

  private initDatePicker(hostComponent = this.hostComponent) {
    if (hostComponent.wrapper?.nativeElement.tagName !== 'KENDO-DATEPICKER') return;

    hostComponent.open.subscribe(x => {
      setTimeout(() => {
        this.init(hostComponent.calendar);
        this.populateCalendar(hostComponent.calendar);
        const intl: JalaliCldrIntlService = hostComponent.calendar.bus.service(hostComponent.calendar.activeViewEnum)._intlService;
        intl.$calendarType.pipe(debounceTime(10)).subscribe(x => {
          hostComponent.calendar.onResize();
        });
        hostComponent.calendar.onResize();
        if (hostComponent?.calendar?.monthView)
          hostComponent.calendar.monthView.headerComponent.title = hostComponent.calendar.monthView.headerComponent.getTitle()
      });
    })
  }

  private initDateInput(hostComponent = this.hostComponent) {
    if (hostComponent.wrapper?.nativeElement.tagName !== 'KENDO-DATEINPUT') return;

  }

  private initCalendar(hostComponent = this.hostComponent) {
    if ((this.viewContainerRef.element.nativeElement as HTMLElement).tagName !== 'kendo-calendar') return;
    this.populateCalendar(hostComponent);
  }
  private populateCalendar(hostComponent: any) {
    const oldNgOnInit = hostComponent.ngOnInit;
    hostComponent.ngOnInit = function (): void {
      oldNgOnInit.call(this);
      const intl: JalaliCldrIntlService = this.bus.service(this.activeViewEnum)._intlService;
      intl.$calendarType.pipe(debounceTime(10)).subscribe(x => {
        this.onResize();
      });
    };
  }

  private setHeaderTitleTemplate(hostComponent = this.hostComponent) {
    if (!Object.hasOwn(hostComponent, 'headerTitleTemplate')) {
      return;
    }
    if (hostComponent.headerTitleTemplate) return;

    setTimeout(() => {
      hostComponent.headerTitleTemplate = this.headerTitleTemplate;
      hostComponent.cdr.detectChanges();
    });
  }

  private setBusService(hostComponent = this.hostComponent) {
    if (!hostComponent.bus) { return; }

    hostComponent.bus.service = (view) => {
      return this.viewContainerRef.injector.get<any>(services[view]) as any;
    }
  }

}
