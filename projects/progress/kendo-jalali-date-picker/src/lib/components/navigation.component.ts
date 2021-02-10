import { NavigationComponent } from '@progress/kendo-angular-dateinputs';

// tslint:disable-next-line:no-string-literal
NavigationComponent.prototype['intlChange'] = function(): void {
  this.cdr.markForCheck();
};
