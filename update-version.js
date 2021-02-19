var myArgs = process.argv.slice(2);
const version = myArgs[0];
console.log("version:", version)
const fs = require('fs');
const saveFile = fs.writeFileSync;


const libraryFolder = './projects/tiampersian/';

fs.readdir(libraryFolder, (err, files) => {
  files.forEach(folder => {
    setLibraryVersion(folder);
  });
});

function setLibraryVersion(lib) {
  const pkgJsonPath = libraryFolder + lib + "/package.json";
  if (!fs.existsSync(pkgJsonPath)) {
    return;
  }
  const json = require(pkgJsonPath);
  json['version'] = version;
  saveFile(pkgJsonPath, JSON.stringify(json, null, 2));
}
