import { TemplateRef } from '@angular/core';
import { HeaderComponent } from "@progress/kendo-angular-dateinputs";

Object.defineProperty(HeaderComponent.prototype, "templateRef", {
  get: function () {

    return 'asdasd';
  },
  set: function (value) {
    this.value = value;
  },
  enumerable: true,
  configurable: true
});
