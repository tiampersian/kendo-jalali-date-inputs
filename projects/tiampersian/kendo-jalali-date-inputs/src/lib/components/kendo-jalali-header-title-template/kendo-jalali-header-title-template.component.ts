import { AfterViewInit, Component, Inject, TemplateRef, ViewChild, ChangeDetectorRef, SkipSelf, Host } from '@angular/core';
import '@angular/localize';
import { IntlService } from '@progress/kendo-angular-intl';
import { JalaliCldrIntlService } from '../../services/jalali-cldr-intl.service';
import { DatePickerType } from '../../models/date-picker-type';

@Component({
  template: `
  <ng-template #template kendoCalendarHeaderTitleTemplate let-title>
    <span class="header-title k-button k-button k-rounded-lg k-button-sm k-button-link-base k-button-link">{{title}}</span>
    <button i18n-title="@@changeCalendarType" title="Change Calendar Type" class="header-calendar-type k-button k-rounded-lg k-button-sm k-button-link-base k-button-link" (click)="toggleCalendarType($event)">
      {{calendarTypes[calendarType]}}
      <i class="k-icon k-i-arrows-swap {{calendarType!=='jalali'&&'k-flip-h'}}" ></i>
    </button>
  </ng-template>`,
  styleUrls: ['./kendo-jalali-header-title-template.component.scss'],
  providers: [
  ]
})
export class KendoJalaliHeaderTitleTemplateComponent implements AfterViewInit {
  @ViewChild('template', { read: TemplateRef }) templateRef = TemplateRef;
  calendarType: DatePickerType;
  calendarTypes = {
    [DatePickerType.gregory]: $localize`:@@jalali:Jalali`,
    [DatePickerType.jalali]: $localize`:@@gregorian:Gregorian`,
  };

  constructor(
     private localeService: JalaliCldrIntlService,
  ) {
    this.calendarType = this.localeService.datePickerType;
  }

  ngAfterViewInit() {
    this.localeService.setTitleTemplate(this);
  }

  toggleCalendarType(event: Event): void {
    console.log('toggleCalendarType', event)
    this.localeService.toggleType();
    this.calendarType = this.localeService.datePickerType;
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }
}

