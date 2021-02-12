import { TemplateRef } from '@angular/core';
import { CalendarComponent } from '@progress/kendo-angular-dateinputs';
import { IntlService } from '@progress/kendo-angular-intl';

let headerTitleTemplate: TemplateRef<any>;
Object.defineProperty(CalendarComponent.prototype, 'headerTitleTemplate', {
  get(): TemplateRef<any> {
    return headerTitleTemplate || this.injector.get(IntlService).defaultTitleTemplate;
  },

  set(template: TemplateRef<any>): void {
    headerTitleTemplate = template || this.injector.get(IntlService).defaultTitleTemplate;
  },
  enumerable: true,
  configurable: true
});
