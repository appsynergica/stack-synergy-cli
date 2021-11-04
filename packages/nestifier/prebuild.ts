import * as fs from 'fs';

import rimraf  from  'rimraf';

const distDir = "../../dist/nestifier";
rimraf(distDir,  () =>{

    fs.mkdirSync(distDir, {recursive: true});
    fs.copyFileSync('./nestifier.json', `${distDir}/nestifier.json`);
    fs.copyFileSync('./package.json', `${distDir}/package.json`);
    fs.copyFileSync('./README.md', `${distDir}/README.md`);

});

