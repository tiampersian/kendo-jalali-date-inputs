// const fs = require('fs');
// const saveFile = fs.writeFileSync;

// saveFile('/home/runner/work/_temp/screenshot', JSON.stringify(json, null, 2));
const captureWebsite = require('capture-website');

(async () => {
  await captureWebsite.file('https://tiampersian.github.io/kendo-jalali-datepicker/', 'src/assets/screenshot.png', {
    overwrite: true
  });
})()
