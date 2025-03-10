import { AfterViewInit, Component, Inject, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import '@angular/localize';
import { IntlService } from '@progress/kendo-angular-intl';
import { JalaliCldrIntlService } from '../../services/jalali-cldr-intl.service';
import { DatePickerType } from '../../models/date-picker-type';
import { arrowsSwapIcon } from "@progress/kendo-svg-icons";
@Component({
  template: `
  <ng-template #template kendoCalendarHeaderTitleTemplate let-title>
    <span >{{title}}</span>
    <button i18n-title="@@changeCalendarType" title="Change Calendar Type" class="header-calendar-type k-button k-rounded-lg k-button-sm k-button-link-base k-button-link" (click)="toggleCalendarType($event)">
      {{calendarTypes[calendarType]}}
      <strong class="k-color-primary">{{calendarTypesSymbol[calendarType]}}</strong>
      <kendo-icon-wrapper name="arrows-swap" [svgIcon]="xIcon" />
    </button>
  </ng-template>`,
  styleUrls: ['./kendo-jalali-header-title-template.component.scss'],
  providers: [],
  standalone: false
})
export class KendoJalaliHeaderTitleTemplateComponent implements AfterViewInit {
  @ViewChild('template', { read: TemplateRef }) templateRef = TemplateRef;
  calendarType: DatePickerType;
  calendarTypes = {
    [DatePickerType.gregory]: $localize`:@@jalali:Jalali`,
    [DatePickerType.jalali]: $localize`:@@gregorian:Gregorian`,
  };
  calendarTypesSymbol = {
    [DatePickerType.gregory]: '☼',
    [DatePickerType.jalali]: '†',
  };
  xIcon = arrowsSwapIcon;

  constructor(
    @Inject(IntlService) private localeService: JalaliCldrIntlService,
  ) {
    this.calendarType = this.localeService.datePickerType;
  }

  ngAfterViewInit() {
    this.localeService.setTitleTemplate(this);
  }

  toggleCalendarType(event: Event): void {
    this.localeService.toggleType();
    this.calendarType = this.localeService.datePickerType;
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }
}

