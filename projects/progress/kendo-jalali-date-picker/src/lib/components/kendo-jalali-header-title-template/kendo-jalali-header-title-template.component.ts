import { JalaliCenturyViewService } from './../../services/century-view.service';
import { AfterViewInit, Component, Inject, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DatePickerType, JalaliCldrIntlService } from '../../services/locale.service';
import '@angular/localize';
import { JalaliDecadeViewService } from '../../services/decade-view.service';
import { JalaliMonthViewService } from '../../services/month-view.service';
import { JalaliYearViewService } from '../../services/year-view.services';
import { JalaliWeekNamesService } from '../../services/week-names.service';
import { CenturyViewService, MonthViewService, WeekNamesService, YearViewService, CalendarComponent } from '@progress/kendo-angular-dateinputs';

@Component({
  template: `
  <ng-template #template kendoCalendarHeaderTitleTemplate let-title>
    <span class="header-title k-flat k-button">{{title}}</span>
    <button class="header-calendar-type k-button" (click)="toggleCalendarType($event)">{{calendarTypes[calendarType]}}</button>
  </ng-template>`,
  styleUrls: ['./kendo-jalali-header-title-template.component.scss'],
  providers: [
  ]
})
export class KendoJalaliHeaderTitleTemplateComponent implements AfterViewInit {
  @ViewChild('template', { read: TemplateRef }) templateRef = TemplateRef;
  calendarType: DatePickerType;
  calendarTypes = {
    [DatePickerType.gregorian]: $localize`:@@jalali:Jalali`,
    [DatePickerType.jalali]: $localize`:@@gregorian:Gregorian`,
  };

  constructor(
    @Inject(IntlService) private localeService: JalaliCldrIntlService,
  ) {
    this.calendarType = this.localeService.datePickerType;
  }

  ngAfterViewInit(){
    debugger
    this.localeService.setTitleTemplate(this);
  }

  toggleCalendarType(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.localeService.toggleType();
    this.calendarType = this.localeService.datePickerType;
  }
}

