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
    this.setBusService();
    this.setHeaderTitleTemplate();
    this.initCalendar();
    this.initDateInput();
    this.initDatePicker();
  }

  private initDatePicker() {
    if (this.hostComponent.wrapper?.nativeElement.tagName !== 'KENDO-DATEPICKER') return;

  }

  private initDateInput() {
    if (this.hostComponent.wrapper?.nativeElement.tagName !== 'KENDO-DATEINPUT') return;

  }

  private initCalendar() {
    if ((this.viewContainerRef.element.nativeElement as HTMLElement).tagName !== 'kendo-calendar') {
      return;
    }
    const oldNgOnInit = this.hostComponent.ngOnInit;
    this.hostComponent.ngOnInit = function (): void {
      oldNgOnInit.call(this);
      const intl: JalaliCldrIntlService = this.bus.service(this.activeViewEnum)._intlService;
      intl.$calendarType.pipe(debounceTime(10)).subscribe(x => {
        this.onResize();
      });
    };
  }

  private setHeaderTitleTemplate() {
    if (!Object.hasOwn(this.hostComponent, 'headerTitleTemplate')) {
      return;
    }
    if (this.hostComponent.headerTitleTemplate) return;
    
    setTimeout(()=>{
      this.hostComponent.headerTitleTemplate = this.headerTitleTemplate;
      this.hostComponent.cdr.detectChanges();
    })
  }

  private setBusService() {
    if (!this.hostComponent.bus) { return; }

    this.hostComponent.bus.service = (view) => {
      return this.viewContainerRef.injector.get<any>(services[view]) as any;
    }
  }

}
