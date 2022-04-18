#!/usr/bin/env node
// import 'module-alias/register';
import {fxnReadJSON, logger} from '@appsynergica/common-cli';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import {AppFileGenerator} from './core/file-generators/app-file-generator';
import { NestifierConfig
} from './core/app-core/app-core';
import * as path from "path";

logger.context = 'Generator';





const nestierConfig: NestifierConfig = fxnReadJSON(path.join(process.cwd(), 'nestifier.json'), false);


const apiFileGenerator = new AppFileGenerator('API', nestierConfig.apiFileRootPaths, nestierConfig.apiFileType, nestierConfig.apiFilePresets, true);
// const coreFileGenerator = new AppFileGenerator('Core', CoreFileRootPath, CoreFileType, CoreFilePresetType, false);
// const serverFileGenerator = new AppFileGenerator('Shared', SharedFileRootPath, SharedFileType, SharedFilePresetType, false);

enum CLIFileGenerationChoices
{
    apiFile = 'API Version File',
    // coreFile = 'Core File',
    // sharedFile = 'Shared File',

    // newApp = 'New App'
}


console.log(
    chalk.yellow(
        figlet.textSync('Nestifier', { horizontalLayout: 'full' })
    )
);

// process.argv.forEach( (value: string, index: number, array: string[]) => {
//
//     console.log(index + ': ' + value);
//
// });

// const command = process.argv[3];



inquirer.prompt([
    {
        name: 'fileGenerationType',
        type: 'list',
        message: 'What would you like to generate?',
        choices: Object.values(CLIFileGenerationChoices)
    }
]).then( answer =>
{

    const fileGenerationResponce = answer.fileGenerationType as CLIFileGenerationChoices;

    switch (fileGenerationResponce)
    {
        case CLIFileGenerationChoices.apiFile:
            apiFileGenerator.masterPrompt();
            break;
        // case CLIFileGenerationChoices.coreFile:
        //     coreFileGenerator.masterPrompt();
        //     break;
        // case CLIFileGenerationChoices.sharedFile:
        //     serverFileGenerator.masterPrompt();
        //     break;
        // case CLIFileGenerationChoices.newApp:
        //     runNewProjectInquirer();
        //     break;

    }

});

// function runNewProjectInquirer()
// {
//     logger.log('New Project generation is comming soon');
// }

