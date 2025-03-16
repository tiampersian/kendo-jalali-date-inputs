// const fs = require('fs');
// const saveFile = fs.writeFileSync;

// saveFile('/home/runner/work/_temp/screenshot', JSON.stringify(json, null, 2));
// const captureWebsite = require('capture-website');

// (async () => {
//   await captureWebsite.file('https://tiampersian.github.io/kendo-jalali-date-inputs/', 'src/assets/screenshot.png', {
//     overwrite: true
//   });
// })()

const puppeteer = require("puppeteer");
puppeteer
  .launch({
    defaultViewport: {
      width: 1280,
      height: 2000,
    },
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.goto("https://tiampersian.github.io/kendo-jalali-date-inputs/");
    await page.screenshot({ path: "src/assets/screenshot.png" });
    await browser.close();
  });
