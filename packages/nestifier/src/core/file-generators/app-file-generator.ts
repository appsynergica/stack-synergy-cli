import * as _ from 'lodash';
import fs from 'fs';
import {NameMaven, logger, spinner, fxnPrettyJsonApi, fxnReadJSON} from '@appsynergica/common-cli';
import chalk from 'chalk';
import replace from 'preserve-case-replace';
import path from 'path';
import inquirer from 'inquirer';
import {AppFileMaven} from "./app-file-maven";
logger.context = 'Generator';
enum AppFileGenerationMode
{
    presetCopying = 'Create Presets',
    templateGeneration = 'Generate file from Template'
}


export class AppFileGenerator<TFileType extends string,
                              TFileRootPath extends string,
                              TFilePreset extends string> extends AppFileMaven<TFileType, TFileRootPath>
{

    constructor(public clusterName: string,
                rootPaths: Record<string, TFileRootPath>,
                public fileTypes: Record<string, TFileType>,
                public filePresets: Record<string, TFilePreset>,
                isVersioned: boolean,
                public templateReadRootDir = path.resolve('./'),
                public templateDestRootDir = process.cwd(),
                public templatePrefix = 'template',
                public templateAPIVersion = 'v1')
    {
        super(rootPaths, isVersioned);
    }

    public masterPrompt()
    {
        inquirer.prompt([
            {
                name: 'fileGenerationMode',
                type: 'list',
                message: 'What would you like to generate?',
                choices: Object.values(AppFileGenerationMode)
            }
        ]).then( answer =>
        {

            const mode = answer.fileGenerationMode as AppFileGenerationMode;

            switch (mode)
            {
                case AppFileGenerationMode.presetCopying:
                    this.runPresetCopyingPrompt();
                    break;
                case AppFileGenerationMode.templateGeneration:
                    this.runTemplateGenerationPrompt();
                    break;
            }

        });
    }


    public runTemplateGenerationPrompt()
    {

        const questions: any[] = [
            {
                name: 'genFileType',
                type: 'checkbox',
                message: `What type of ${this.clusterName} File would you like to generate?`,
                choices: Object.values(this.fileTypes).map(x => _.snakeCase(x))
            },
            {
                name: 'genFileNamePrefix',
                type: 'input',
                message: 'What\'s the file name prefix'
            }

        ];

        if (this.isVersioned)
        {
            questions.push({
                name: 'genVersion',
                type: 'list',
                message: 'What\'s the API Version',
                choices: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6']
            });
        }

        inquirer.prompt(questions).then( answer => {

               // logger.verbose(`Got api file type ${answer.genFileType}`);
               // logger.verbose(`Got api version ${answer.genVersion}`);
               // logger.verbose(`Got api file name prefix ${answer.genFileNamePrefix}`);

                if (this.isVersioned && !answer.genVersion)
                {
                    logger.error('Use the space bar to select a version');
                    return;
                }

                if (!answer.genFileType)
                {
                    logger.error(`${this.clusterName} file type is ${chalk.red('required')}`);
                    return;
                }

                const fileNamePrefix = answer.genFileNamePrefix as string;

                if (fileNamePrefix.match(/\|/)) // check if names are delimited using the pipe char
                {
                  const splitNames = fileNamePrefix.split('|');

                  // create files for each delimited - split name
                  splitNames.forEach( x => {

                    // just a single api file

                    this.generateMultipleFiles(answer.genFileType as TFileType, x.trim(), answer.genVersion);


                  });
                }else{
                  // just a single api file

                  this.generateMultipleFiles(answer.genFileType as TFileType, answer.genFileNamePrefix, answer.genVersion);

                }



            });
    }


    public runPresetCopyingPrompt()
    {

        const questions: any[] = [
            {
                name: 'genFileType',
                type: 'checkbox',
                message: `What type of ${this.clusterName} Presets would you like to generate?`,
                choices: Object.values(this.fileTypes).map(x => _.snakeCase(x))
            },
            {
                name: 'genFileNamePrefix',
                type: 'checkbox',
                message: `What ${this.clusterName} actual Presets would you like to generate?`,
                choices: Object.values(this.filePresets).map(x => _.snakeCase(x))

            }];

        if (this.isVersioned)
        {
            questions.push({
                name: 'genVersion',
                type: 'list',
                message: `What's the ${this.clusterName} Version`,
                choices: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6']
            });
        }

        inquirer.prompt(questions).then( answer => {

           // logger.verbose(`Got api file type ${answer.genFileType}`);
           // logger.verbose(`Got api version ${answer.genVersion}`);
           // logger.verbose(`Got api file name prefix ${answer.genFileNamePrefix}`);

            if (this.isVersioned && !answer.genVersion)
            {
                logger.error('Use the space bar to select a version');
                return;
            }

            if (!answer.genFileType)
            {
                logger.error(`${this.clusterName} file type is ${chalk.red('required')}`);
                return;
            }



            // just a single api file

            this.copyMultipleFiles(answer.genFileType as TFileType, answer.genFileNamePrefix, answer.genVersion);


        });
    }


    protected generateFile(fileType: TFileType, fileNamePrefix: string, version: string)
    {

        // logger.verbose(`AppFileGenerator generate-> called with fileType ${fxnPrettyJsonApi(fileType)} fileNamePrefix ${fxnPrettyJsonApi(fileNamePrefix)} version ${fxnPrettyJsonApi(version)}`);
        const nameMaven = new NameMaven(fileType, fileNamePrefix);

        this.createDirectoryOfFileWithType(this.templateDestRootDir, fileType, fileNamePrefix, version);

        const destFolder = this.getDirectoryOfFileWithType(this.templateDestRootDir, fileType, fileNamePrefix, version);

        const fullFilePath = `${destFolder}/${nameMaven.standardFileName()}`;
        const fullTestFilePath = `${destFolder}/${nameMaven.standardTestFileName()}`;

        const isToAddTestFile = ['controller', 'service'].includes(fileType);


        // logger.verbose(`generating ${fxnPrettyJsonApi(fileType)} : ${nameMaven.standardFileName()} with Path: ${fxnPrettyJsonApi(fullFilePath)}`);

          // spinner.text = `generating ${fxnPrettyJsonApi(fileType)} : ${nameMaven.standardFileName()} with Path: ${fxnPrettyJsonApi(fullFilePath)}`;

        try {
            fs.writeFileSync(fullFilePath, this.getTemplate(fileType, fileNamePrefix, version), { flag: 'wx' });

            // also write the corresponding test file if the file is associated with a test
            if (isToAddTestFile)
          {
            fs.writeFileSync(fullTestFilePath, this.getTemplate(fileType, fileNamePrefix, version, true), { flag: 'wx' });
          }

            // logger.verbose(`${_.upperFirst(fxnPrettyJsonApi(fileType))} with name: ${nameMaven.standardFileName()} generated successfully`);

           // spinner.text = `${_.upperFirst(fxnPrettyJsonApi(fileType))} with name: ${nameMaven.standardFileName()} generated successfully`;

            logger.log(`${nameMaven.standardGeneratedClassName} -> ${fxnPrettyJsonApi(fullFilePath)}`, 'CREATED');

        }catch (e) {

            if (e.code === 'EEXIST')
            {
                throw new Error(`${e.errno}: ${_.upperFirst(fileType)} with class name: ${nameMaven.standardGeneratedClassName} already exists at path ${fullFilePath}`);

            }else{
                // logger.error(`${e.errno}: ${e.code}`);
                throw e;
            }

        }

    }


    copyMultipleFiles(fileType: TFileType[] | TFileType, presetFileNamePrefix: TFilePreset[] | TFilePreset, version: string)
    {

        // if a filename prefix exists, then someone wants to generate a file, therefore all the
        // properties needed to generate a file must be set
        // otherwise someone probably wants to generate some presets

            if (!fileType)
            {
                logger.error(`A preset file type is ${chalk.red('required')} for file generation`);
                return;
            }
            if (!presetFileNamePrefix)
            {
                logger.error(`A Preset file name prefix is ${chalk.red('required')} for file generation`);
                return;
            }
            if (this.isVersioned && !version)
            {
                logger.error(`A Preset File Api Destination version is ${chalk.red('required')} for file generation`);
                return;
            }

            spinner.start(`Copying files`);

            try{


                if (fileType instanceof Array)
                {
                    fileType.forEach( singFileType =>
                    {
                        if (presetFileNamePrefix instanceof Array) // fileType === array && presetFileNamePrefix === array
                        {
                            presetFileNamePrefix.forEach(singPresetFileNamePrefix => {

                                this.copyPreset(singFileType, singPresetFileNamePrefix, version);

                            });

                        }else{ // fileType === array && presetFileNamePrefix === string

                            this.copyPreset(singFileType, presetFileNamePrefix, version);

                        }
                    });
                }
                else if (typeof fileType === 'string')
                {
                    if (presetFileNamePrefix instanceof Array) // fileType === string && presetFileNamePrefix === array
                    {
                        presetFileNamePrefix.forEach(singPresetFileNamePrefix =>
                        {

                            this.copyPreset(fileType, singPresetFileNamePrefix, version);

                        });

                    } else // fileType === string && presetFileNamePrefix === string
                        {
                        this.copyPreset(fileType, presetFileNamePrefix, version);

                    }
                }

          } catch (e)
        {
            spinner.stop();
            logger.error(e, e?.stack);

        }


            spinner.stop();

    }

    generateMultipleFiles(fileType: TFileType[] | TFileType, fileNamePrefix: string, version: string)
    {

        // if a filename prefix exists, then someone wants to generate a file, therefore all the
        // properties needed to generate a file must be set
        // otherwise someone probably wants to generate some presets

            if (!fileType)
            {
                logger.error(`A file type is ${chalk.red('required')} for file generation`);
                return;
            }
            if (!fileNamePrefix)
            {
                logger.error(`A file name prefix is ${chalk.red('required')} for file generation`);
                return;
            }
            if (this.isVersioned && !version)
            {
                logger.error(`An api version is ${chalk.red('required')} for file generation`);
                return;
            }

            spinner.start(`Generating files`);

            try{
           if (fileNamePrefix && fileType && version)
           {
               if (fileType instanceof Array)
               {
                   fileType.forEach( x => {
                       this.generateFile(x, fileNamePrefix, version);
                   });
               }else {

                   this.generateFile(fileType, fileNamePrefix, version);

               }
           }

        } catch (e)
        {
            spinner.stop();
            logger.error(e, e?.stack);

        }


            spinner.stop();

    }

    copyPreset(fileType: TFileType, fileNamePrefix: string, version: string)
    {
        const nameMavenOfTemplate = new NameMaven(fileType, fileNamePrefix);

        const destPath = this.copyFileWithType(this.templateReadRootDir, this.templateDestRootDir, fileType, this.templateAPIVersion, version, nameMavenOfTemplate.standardFileNamePrefix, nameMavenOfTemplate.standardFileName(true));

        // logger.verbose(`${nameMavenOfTemplate.standardGeneratedClassName} -> ${fxnPrettyJsonApi(destPath)}`, 'COPIED');
    }

     getTemplate(fileType: TFileType, fileNamePrefix: string, version: string, isTestFile = false): string
    {

        const nameMavenDestination = new NameMaven(fileType, fileNamePrefix);
        const nameMavenOfTemplate = new NameMaven(fileType, this.templatePrefix);

        // logger.verbose(`Will Use 7V6 nameMavenDestination: ${nameMavenDestination.toString}`);
        // logger.verbose(`Will Use 7V6 nameMavenOfTemplate: ${nameMavenOfTemplate.toString}`);


        // logger.verbose(`AppFileTemplates getTemplate--> fileType: ${fileType} fileNamePrefix : ${fileNamePrefix} yeilded templateFileName : ${nameMavenOfTemplate.standardFileName(true)}`);

        const terminalFolderName = nameMavenOfTemplate.standardFileNamePrefix;
        const finalFileName = isTestFile ? nameMavenOfTemplate.standardTestFileName(true) : nameMavenOfTemplate.standardFileName(true);

        let contents = this.readFileWithType(this.templateReadRootDir, fileType, this.templateAPIVersion, terminalFolderName, finalFileName);

       // logger.verbose(`AppFileTemplates getTemplate--> fileType: ${fileType} fileNamePrefix : ${fileNamePrefix} yeilded contents : ${contents}`);


        // protect RoleType from match case replacement
       // contents = contents.replace( `${nameMavenOfTemplate.standardEntityVariableName}Type`, `R-P-L-Protected-1`);

        let reg = RegExp(`${nameMavenOfTemplate.standardFileNamePrefix}\\.`, 'g');
        contents = contents.replace( reg, `${nameMavenDestination.standardFileNamePrefix}.`);

        reg = RegExp(`\/${nameMavenOfTemplate.standardFileNamePrefix}\/`, 'g');
        contents = contents.replace( reg, `\/${nameMavenDestination.standardFileNamePrefix}\/`);

        contents = replace(contents, nameMavenOfTemplate.standardEntityVariableName, nameMavenDestination.standardEntityVariableName);

        reg = RegExp(`${nameMavenDestination.standardEntityVariableName.toLowerCase()}`, 'g');
        contents = contents.replace( reg, `${nameMavenDestination.standardEntityVariableName}`);


        // contents = contents.replace( `.${nameMavenDestination.standardEntityVariableName.toLowerCase()}`, `.${nameMavenDestination.standardEntityVariableName}`);

        // fix any remaining preserve case errors
        // contents = contents.replace( nameMavenDestination.standardEntityVariableName.toLowerCase(), nameMavenDestination.standardEntityVariableName);

        // Return RoleType to it's original state
        // contents = contents.replace( `R-P-L-Protected-1`, `${nameMavenOfTemplate.standardEntityVariableName}Type`);

       // logger.verbose(`AppFileTemplates getTemplate--> got final replaced contents: ${contents}`);

        return contents;

    }

}

