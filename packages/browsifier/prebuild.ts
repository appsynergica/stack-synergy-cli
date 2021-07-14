import * as fs from 'fs';

import rimraf  from  'rimraf';
import path from 'path';

const distDir = path.resolve(process.cwd(), "../../dist/browsifier");
rimraf(distDir,  () =>{

    fs.mkdirSync(distDir, {recursive: true});

    fs.copyFileSync('./package.json', `${distDir}/package.json`);
    fs.copyFileSync('./README.md', `${distDir}/README.md`);

});

