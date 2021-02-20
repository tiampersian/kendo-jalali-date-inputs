import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tiNumber' })
export class NumberPipe implements PipeTransform {
  numbers = {
    0: $localize`:@@0:۰`,
    1: $localize`:@@1:۱`,
    2: $localize`:@@2:۲`,
    3: $localize`:@@3:۳`,
    4: $localize`:@@4:۴`,
    5: $localize`:@@5:۵`,
    6: $localize`:@@6:۶`,
    7: $localize`:@@7:۷`,
    8: $localize`:@@8:۸`,
    9: $localize`:@@9:۹`,
  }
  constructor(
    @Inject(LOCALE_ID) localeId: string
  ) {
    if (localeId.startsWith('fa') || localeId.startsWith('ar')) {
      this.transform = this.translatorTransform;
    }
  }

  transform(value: string) {
    return value;
  }
  translatorTransform(value: any): any {
    return value.replace(/[0-9]/g, function (d) {
      return this.numbers[d];
    })
  }
}
