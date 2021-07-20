import * as fs from 'fs';

import rimraf  from  'rimraf';

const distDir = "../../dist/graphqlizer";
rimraf(distDir,  () =>{

    fs.mkdirSync(distDir, {recursive: true});

    fs.copyFileSync('./package.json', `${distDir}/package.json`);
    fs.copyFileSync('./README.md', `${distDir}/README.md`);

});

