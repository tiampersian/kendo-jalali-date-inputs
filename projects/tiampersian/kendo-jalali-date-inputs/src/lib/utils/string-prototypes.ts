declare global {
  interface String {
    toPerNumber(): string;
    toEnNumber(): string;
    toMomentDateTimeFormat(): string;
  }
}

String.prototype.toPerNumber = function () {
  return this.replace(/\d/g, (match) => {
    return enToPerNumberMap[match] || match;
  });
};
String.prototype.toEnNumber = function () {
  return this.replace(/[١٢٣٤٥٦٧٨٩٠]/g, (match) => {
    return perToEnNumberMap[match] || match;
  });
};
String.prototype.toMomentDateTimeFormat = function () {
  let x = this.replace(/d/g, 'D')
  .replace(/aa/ig, (m) => m[0])
  .replace(/_/g, '/')
  .replace(/[y]{1,}/, 'YYYY');

  return x;
};

export const enToPerNumberMap = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠'
};
export const perToEnNumberMap = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0'
};