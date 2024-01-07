import { Injector, createComponent } from '@angular/core';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';


export function HeaderTitleTemplateFactory(
  injector: Injector
): any {
  const componentRef = createComponent(KendoJalaliHeaderTitleTemplateComponent, {
    elementInjector: injector, 
  } as any);
  componentRef.changeDetectorRef.detectChanges();
  return (componentRef.instance as KendoJalaliHeaderTitleTemplateComponent);
}
