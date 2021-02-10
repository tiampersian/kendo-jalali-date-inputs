import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DatePickerType, JalaliCldrIntlService } from '../../services/locale.service';

@Component({
  template: `
  <ng-template #template kendoCalendarHeaderTitleTemplate let-title>
    <span class="header-title k-flat k-button">{{title}}</span>
    <button class="header-calendar-type k-button" (click)="toggleCalendarType($event)">{{calendarTypes[calendarType]}}</button>
  </ng-template>`,
  styleUrls: ['./kendo-jalali-header-title-template.component.scss']
})
export class KendoJalaliHeaderTitleTemplateComponent {
  @ViewChild('template', { read: TemplateRef }) templateRef = TemplateRef;
  calendarType: any;
  calendarTypes = {
    [DatePickerType.gregorian]: $localize`:@@jalali:Jalali`,
    [DatePickerType.jalali]: $localize`:@@gregorian:Gregorian`,
  };

  constructor(
    @Inject(IntlService) private localeService: JalaliCldrIntlService,
  ) {
    this.calendarType = this.localeService.datePickerType;
  }

  toggleCalendarType(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.localeService.toggleType();
    this.calendarType = this.localeService.datePickerType;
  }
}
