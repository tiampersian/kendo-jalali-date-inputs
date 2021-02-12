import { Injector, ComponentFactoryResolver } from '@angular/core';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';



export function HeaderTitleTemplateFactory(
  injector: Injector, resolver: ComponentFactoryResolver
): any {
  const temp = resolver.resolveComponentFactory(KendoJalaliHeaderTitleTemplateComponent as any).create(injector);
  temp.changeDetectorRef.detectChanges();
  return (temp.instance as KendoJalaliHeaderTitleTemplateComponent);
}
