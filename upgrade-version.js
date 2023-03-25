var myArgs = process.argv.slice(2);
const fs = require('fs');
const { exec } = require("child_process");
const saveFile = fs.writeFileSync;

const pkgJsonPath = "./package.json";
const json = require(pkgJsonPath);

async function upgradeProjectPackage(){
  console.info('go to upgradeProjectPackage()');
  if (!fs.existsSync(pkgJsonPath)) {
    console.log('update()');
    return;
  }

  await updatePackages(json['dependencies']);
  await updatePackages(json['devDependencies']);
}

async function updatePackages(dependencies) {
  const p=new Promise((r)=>{
    let counter2=0;
    let counter=0;
    for (const key in dependencies) {
      counter++;
      exec(`npm view ${key} version`, (err, stdout, stderr) => {
        counter2++;
        if(counter2>=counter){
          setTimeout(() => {
            r();
          });
        }

        if (err) {

          console.error(`npm view ${key} version`, err);
          return;
        }
        console.log(`npm view ${key} version`, stdout);
        dependencies[key] = stdout.replace('\n', '');
        saveFile(pkgJsonPath, JSON.stringify(json, null, 2));
      });
    }
  })
  return p;
}

upgradeProjectPackage();

function setLibraryVersion(lib) {
  const pkgJsonPath = libraryFolder + lib + "/package.json";
  if (!fs.existsSync(pkgJsonPath)) {
    return;
  }
  const json = require(pkgJsonPath);
  json['version'] = version;
  saveFile(pkgJsonPath, JSON.stringify(json, null, 2));
}
