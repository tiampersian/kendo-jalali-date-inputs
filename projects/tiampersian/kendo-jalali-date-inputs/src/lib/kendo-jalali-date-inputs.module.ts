import { ModuleWithProviders, NgModule } from '@angular/core';
import '@angular/localize/init';
import { IntlModule, setData } from '@progress/kendo-angular-intl';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import jalaliday from 'jalaliday';
import { KendoJalaliHeaderTitleTemplateComponent } from './components/kendo-jalali-header-title-template/kendo-jalali-header-title-template.component';
import { KendoDatePickerDirective } from './components/navigation.directive';
import { IConfig } from './models/config.model';
import { Providers } from './providers';
import { DateTimeNumberService } from './services/date-time-number.service';
import './utils/string-prototypes';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IconsModule, IconWrapperComponent } from '@progress/kendo-angular-icons';

dayjs.extend(jalaliday);
dayjs.extend(isBetween);
dayjs.extend(localeData);
if (typeof window !== 'undefined') {
  window['dayjs'] = dayjs;
}

setData({
  name: "fa",
  likelySubtags: {
    fa: "fa-Arab-IR"
  },
  identity: {
    language: "fa"
  },
  territory: "IR",
  calendar: {
    patterns: {
      d: "y/M/d",
      D: "EEEE d MMMM y",
      m: "d LLL",
      M: "d LLLL",
      y: "MMM y",
      Y: "MMMM y",
      F: "EEEE d MMMM y h:mm:ss a",
      g: "y/M/d h:mm a",
      G: "y/M/d h:mm:ss a",
      t: "h:mm a",
      T: "h:mm:ss a",
      s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
      u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'"
    },
    dateTimeFormats: {
      full: "{1}، ساعت {0}",
      long: "{1}، ساعت {0}",
      medium: "{1}،‏ {0}",
      short: "{1}،‏ {0}",
      availableFormats: {
        Bh: "h B",
        Bhm: "h:mm B",
        Bhms: "h:mm:ss B",
        d: "d",
        E: "ccc",
        EBhm: "E h:mm B",
        EBhms: "E h:mm:ss B",
        Ed: "E d",
        Ehm: "E h:mm a",
        EHm: "E H:mm",
        Ehms: "E h:mm:ss a",
        EHms: "E H:mm:ss",
        Gy: "y G",
        GyMMM: "MMM y G",
        GyMMMd: "d MMM y G",
        GyMMMEd: "E d MMM y G",
        h: "h a",
        H: "H",
        HHmmZ: "HH:mm (Z)",
        hm: "h:mm a",
        Hm: "H:mm",
        hms: "h:mm:ss a",
        Hms: "H:mm:ss",
        hmsv: "h:mm:ss a v",
        Hmsv: "H:mm:ss v",
        hmv: "h:mm a v",
        Hmv: "H:mm v",
        M: "L",
        Md: "M/d",
        MEd: "E M/d",
        MMM: "LLL",
        MMMd: "d LLL",
        MMMEd: "E d LLL",
        MMMMd: "d LLLL",
        MMMMEd: "E d LLLL",
        "MMMMW-count-one": "هفتهٔ Wم LLLL",
        "MMMMW-count-other": "هفتهٔ Wم LLLL",
        mmss: "mm:ss",
        ms: "m:ss",
        y: "y",
        yM: "y/M",
        yMd: "y/M/d",
        yMEd: "E y/M/d",
        yMMM: "MMM y",
        yMMMd: "d MMM y",
        yMMMEd: "E d MMM y",
        yMMMM: "MMMM y",
        yMMMMEEEEd: "EEEE d MMMM y",
        yQQQ: "QQQQ y",
        yQQQQ: "QQQQ y",
        "yw-count-one": "هفتهٔ wم Y",
        "yw-count-other": "هفتهٔ wم Y"
      }
    },
    timeFormats: {
      full: "H:mm:ss (zzzz)",
      long: "H:mm:ss (z)",
      medium: "H:mm:ss",
      short: "H:mm"
    },
    dateFormats: {
      full: "EEEE d MMMM y",
      long: "d MMMM y",
      medium: "d MMM y",
      short: "y/M/d"
    },
    days: {
      format: {
        abbreviated: [
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه"
        ],
        narrow: [
          "ی",
          "د",
          "س",
          "چ",
          "پ",
          "ج",
          "ش"
        ],
        short: [
          "۱ش",
          "۲ش",
          "۳ش",
          "۴ش",
          "۵ش",
          "ج",
          "ش"
        ],
        wide: [
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه"
        ]
      },
      "stand-alone": {
        abbreviated: [
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه"
        ],
        narrow: [
          "ی",
          "د",
          "س",
          "چ",
          "پ",
          "ج",
          "ش"
        ],
        short: [
          "۱ش",
          "۲ش",
          "۳ش",
          "۴ش",
          "۵ش",
          "ج",
          "ش"
        ],
        wide: [
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه"
        ]
      }
    },
    months: {
      format: {
        abbreviated: [
          "ژانویهٔ",
          "فوریهٔ",
          "مارس",
          "آوریل",
          "مهٔ",
          "ژوئن",
          "ژوئیهٔ",
          "اوت",
          "سپتامبر",
          "اکتبر",
          "نوامبر",
          "دسامبر"
        ],
        narrow: [
          "ژ",
          "ف",
          "م",
          "آ",
          "م",
          "ژ",
          "ژ",
          "ا",
          "س",
          "ا",
          "ن",
          "د"
        ],
        wide: [
          "ژانویهٔ",
          "فوریهٔ",
          "مارس",
          "آوریل",
          "مهٔ",
          "ژوئن",
          "ژوئیهٔ",
          "اوت",
          "سپتامبر",
          "اکتبر",
          "نوامبر",
          "دسامبر"
        ]
      },
      "stand-alone": {
        abbreviated: [
          "ژانویه",
          "فوریه",
          "مارس",
          "آوریل",
          "مه",
          "ژوئن",
          "ژوئیه",
          "اوت",
          "سپتامبر",
          "اکتبر",
          "نوامبر",
          "دسامبر"
        ],
        narrow: [
          "ژ",
          "ف",
          "م",
          "آ",
          "م",
          "ژ",
          "ژ",
          "ا",
          "س",
          "ا",
          "ن",
          "د"
        ],
        wide: [
          "ژانویه",
          "فوریه",
          "مارس",
          "آوریل",
          "مه",
          "ژوئن",
          "ژوئیه",
          "اوت",
          "سپتامبر",
          "اکتبر",
          "نوامبر",
          "دسامبر"
        ]
      }
    },
    quarters: {
      format: {
        abbreviated: [
          "س‌م۱",
          "س‌م۲",
          "س‌م۳",
          "س‌م۴"
        ],
        narrow: [
          "۱",
          "۲",
          "۳",
          "۴"
        ],
        wide: [
          "سه‌ماههٔ اول",
          "سه‌ماههٔ دوم",
          "سه‌ماههٔ سوم",
          "سه‌ماههٔ چهارم"
        ]
      },
      "stand-alone": {
        abbreviated: [
          "س‌م۱",
          "س‌م۲",
          "س‌م۳",
          "س‌م۴"
        ],
        narrow: [
          "۱",
          "۲",
          "۳",
          "۴"
        ],
        wide: [
          "سه‌ماههٔ اول",
          "سه‌ماههٔ دوم",
          "سه‌ماههٔ سوم",
          "سه‌ماههٔ چهارم"
        ]
      }
    },
    dayPeriods: {
      format: {
        abbreviated: {
          am: "ق.ظ.",
          pm: "ب.ظ.",
          morning1: "بامداد",
          morning2: "صبح",
          afternoon1: "ظهر",
          afternoon2: "عصر",
          night1: "شب",
          night2: "نیمه‌شب"
        },
        narrow: {
          am: "ق",
          pm: "ب",
          morning1: "ب",
          morning2: "ص",
          afternoon1: "ظ",
          afternoon2: "ع",
          night1: "ش",
          night2: "ن"
        },
        wide: {
          am: "قبل‌ازظهر",
          pm: "بعدازظهر",
          morning1: "بامداد",
          morning2: "صبح",
          afternoon1: "ظهر",
          afternoon2: "عصر",
          night1: "شب",
          night2: "نیمه‌شب"
        }
      },
      "stand-alone": {
        abbreviated: {
          am: "ق.ظ.",
          pm: "ب.ظ.",
          morning1: "بامداد",
          morning2: "صبح",
          afternoon1: "ظهر",
          afternoon2: "عصر",
          night1: "شب",
          night2: "نیمه‌شب"
        },
        narrow: {
          am: "ق",
          pm: "ب",
          morning1: "ب",
          morning2: "ص",
          afternoon1: "ظ",
          afternoon2: "ع",
          night1: "ش",
          night2: "ن"
        },
        wide: {
          am: "قبل‌ازظهر",
          pm: "بعدازظهر",
          morning1: "بامداد",
          morning2: "صبح",
          afternoon1: "ظهر",
          afternoon2: "عصر",
          night1: "شب",
          night2: "نیمه‌شب"
        }
      }
    },
    eras: {
      format: {
        wide: {
          "0": "قبل از میلاد",
          "1": "میلادی",
          "0-alt-variant": "قبل از دوران مشترک",
          "1-alt-variant": "دوران مشترک"
        },
        abbreviated: {
          "0": "ق.م.",
          "1": "م.",
          "0-alt-variant": "ق.د.م",
          "1-alt-variant": "د.م."
        },
        narrow: {
          "0": "ق",
          "1": "م",
          "0-alt-variant": "ق.د.م",
          "1-alt-variant": "د.م."
        }
      }
    },
    gmtFormat: "{0} گرینویچ",
    gmtZeroFormat: "گرینویچ",
    dateFields: {
      era: {
        wide: "دوره",
        short: "دوره",
        narrow: "دوره"
      },
      year: {
        wide: "سال",
        short: "سال",
        narrow: "سال"
      },
      quarter: {
        wide: "سه‌ماهه",
        short: "سه‌ماهه",
        narrow: "سه‌ماهه"
      },
      month: {
        wide: "ماه",
        short: "ماه",
        narrow: "ماه"
      },
      week: {
        wide: "هفته",
        short: "هفته",
        narrow: "هفته"
      },
      weekOfMonth: {
        wide: "هفتهٔ ماه",
        short: "هفتهٔ ماه",
        narrow: "هفتهٔ ماه"
      },
      day: {
        wide: "روز",
        short: "روز",
        narrow: "روز"
      },
      dayOfYear: {
        wide: "روز سال",
        short: "روز سال",
        narrow: "روز سال"
      },
      weekday: {
        wide: "روز هفته",
        short: "روز هفته",
        narrow: "روز هفته"
      },
      weekdayOfMonth: {
        wide: "روز کاری ماه",
        short: "روز کاری ماه",
        narrow: "روز کاری ماه"
      },
      dayperiod: {
        short: "قبل/بعدازظهر",
        wide: "قبل/بعدازظهر",
        narrow: "قبل/بعدازظهر"
      },
      hour: {
        wide: "ساعت",
        short: "ساعت",
        narrow: "ساعت"
      },
      minute: {
        wide: "دقیقه",
        short: "دقیقه",
        narrow: "دقیقه"
      },
      second: {
        wide: "ثانیه",
        short: "ثانیه",
        narrow: "ثانیه"
      },
      zone: {
        wide: "منطقهٔ زمانی",
        short: "منطقهٔ زمانی",
        narrow: "منطقهٔ زمانی"
      }
    }
  },
  firstDay: 6
});

@NgModule({
  declarations: [
    KendoJalaliHeaderTitleTemplateComponent,
    KendoDatePickerDirective,
  ],
  imports: [
    IntlModule,
    DateInputsModule,
    IconWrapperComponent
  ],
  providers: [
    ...Providers,
    DateTimeNumberService,
    { provide: 'CONFIGS', useValue: {} }
  ],
  exports: [
    DateInputsModule,
    KendoDatePickerDirective,
  ]
})
export class KendoJalaliDateInputsModule {
  constructor(
  ) {
  }

  static forRoot(configs?: IConfig): ModuleWithProviders<KendoJalaliDateInputsModule> {
    return {
      ngModule: KendoJalaliDateInputsModule,
      providers: [
        { provide: 'CONFIGS', useValue: { ...configs } }
      ]
    };
  }
}



