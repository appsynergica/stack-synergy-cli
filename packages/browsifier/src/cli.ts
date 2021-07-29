#!/usr/bin/env node
import yargs from 'yargs';
import {logger} from '@desmondrg/common-cli';
import {FileGenerator, IFileGeneratorOptions} from '@desmondrg/common-cli';
import {BrowserFileGenerator} from './core/file-generator/browser-file-generator';
logger.context = 'Browsifier';

const options: any = yargs.options({
    s: {
        alias: 'source',
        demandOption: true,
        default: `${process.cwd()}/server/core/database/entities`,
        describe: 'The path to the folder containing the TypeORM Entities that need to be stripped of decorators',
        type: 'string'
    },
    o: {
        alias: 'output',
        demandOption: true,
        default: `${process.cwd()}/src/app/core/database/entities`,
        describe: 'The output path to place TypeORM entities that have been stripped of decorators',
        type: 'string'
    },
    n: {
        alias: 'name',
        demandOption: true,
        default: `p`,
        describe: 'The Naming Style for the Output file p = pascal | c = camelCase | k = kebab | s = snakeCase',
        type: 'string'
    },
    q: {
        alias: 'quote',
        demandOption: true,
        default: true,
        describe: 'Whether to quote imports using single quotes or double quotes. Where true -> use single quotes',
        type: 'boolean'
    },
    i: {
        alias: 'indent',
        demandOption: true,
        default: 'four',
        describe: 'The Number of spaces to indent text by : two|four|eight|tab',
        type: 'boolean'
    },
    f: {
        alias: 'feed',
        demandOption: true,
        default: 'n',
        describe: 'Whether to use the new line character or the carriage return for the line feed : n|c',
        type: 'string'
    },
    c: {
        alias: 'comma',
        demandOption: false,
        default: false,
        describe: 'Whether to use trailing commas or not',
        type: 'boolean'
    },
    p: {
        alias: 'prefix',
        demandOption: false,
        default: false,
        describe: 'Whether to use prefix and suffix text for rename',
        type: 'boolean'
    },

}).argv;


// logger.log(JSON.stringify(options, null, 2));

const sourceDirOfEntities = `${options.source}/*.ts`;
const outPutOfEntities = `${options.output}`;

const decOptions: IFileGeneratorOptions = {
    sourceFilePathGlob: sourceDirOfEntities,
    outputRootPath: outPutOfEntities,
    isToSingleQuotes: options.quote as boolean,
    fileNameType: options.name,
    indentationText: options.indent,
    lineFeedKind: options.feed,
    isToUseTrailingCommas: options.comma,
    isToUsePrefixAndSuffixTextForRename: options.prefix
};


const rootGenerator = new FileGenerator(decOptions);

const browserFileGenerator = new BrowserFileGenerator(decOptions);


rootGenerator.project.getSourceFiles().forEach((singSourceFile) => {

    const classes = singSourceFile.getClasses();

    classes.forEach((singClass) => {
        // We check if it is the class we want to rename
        if (singClass.getName())
        {

            browserFileGenerator.generateBrowserClass(singSourceFile, singClass);

        }
    });

});