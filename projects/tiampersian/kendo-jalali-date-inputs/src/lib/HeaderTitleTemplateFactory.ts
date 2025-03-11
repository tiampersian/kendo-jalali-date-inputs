import { createComponent, EnvironmentInjector } from '@angular/core';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';



export function HeaderTitleTemplateFactory(
  environmentInjector: EnvironmentInjector
): any {
  const temp = createComponent(KendoJalaliHeaderTitleTemplateComponent as any, { environmentInjector });
  temp.changeDetectorRef.detectChanges();
  return (temp.instance as KendoJalaliHeaderTitleTemplateComponent);
}
