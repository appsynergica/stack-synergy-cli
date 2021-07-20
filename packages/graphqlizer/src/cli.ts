#!/usr/bin/env node
import yargs from 'yargs';
import {logger,FileGenerator, fxnReadJSON} from '@urbanshona/common-cli';
import {IGraphqlizerConfig} from './core/core-gen';
import {ServerAPIFileGenerator} from './core/file-generator/server-api-file-generator';
logger.context = 'graphqlizer';

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

    // Begin Graphqlizer Options
    v: {
        alias: 'validator',
        demandOption: true,
        default: true,
        describe: 'Add Class Validator Decorators',
        type: 'boolean'
    },
    g: {
        alias: 'graphql',
        demandOption: true,
        default: true,
        describe: 'Add Nest JS GraphQLValidators',
        type: 'boolean'
    },
    t: {
        alias: 'optional',
        demandOption: true,
        default: false,
        describe: 'Is Every Non Primary Key Property Optional',
        type: 'boolean'
    },
    j: {
        alias: 'object',
        demandOption: true,
        default: 'o',
        describe: 'GraphQL Object Type',
        type: 'string'
    },
    x: {
        alias: 'nop',
        demandOption: true,
        default: 'false',
        describe: 'Whether or not to create an empty stub class definition',
        type: 'boolean'
    },
    P: {
        alias: 'project',
        demandOption: false,
        default: './graphqlizer.json',
        describe: 'The Config file to use instead of all the other command line options',
        type: 'boolean'
    },

}).argv;

let gqlsifierConfig: IGraphqlizerConfig;

if(options.project)
{
    gqlsifierConfig = fxnReadJSON(options.project, false);

    if(!gqlsifierConfig)
    {
        gqlsifierConfig = {

            // Graphqlizer Options : Base Class Options
            globalOptions: {
                sourceFilePathGlob: options.source,
                outputRootPath: options.output,
                isToSingleQuotes: options.quote as boolean,
                fileNameType: options.name,
                indentationText: options.indent,
                lineFeedKind: options.feed,
                isToUseTrailingCommas: options.comma,
                isToUsePrefixAndSuffixTextForRename: options.prefix,
            },
            outputClasses: [
                {
                    className: "{{sourceClassName}}",
                    graphqlObjectType: options.object,
                    filePath: `{{outputRootPath}}/{{sourceClassName}}.ts`,
                    isEverythingOptional: options.optional,
                    isToAddClassValidatorDecorators: options.validator,
                    isToAddNestJSGraphQLDecorators: options.graphql,
                    hasNoProperties: options.nop
                }
            ]

            // Graphqlizer Options : IDecorator Options


        };

    }
}


// logger.log(JSON.stringify(options, null, 2));

// logger.log(JSON.stringify(options, null, 2));



const rootGenerator = new FileGenerator(gqlsifierConfig.globalOptions);

const serverAPIFileGenerator = new ServerAPIFileGenerator(gqlsifierConfig);


rootGenerator.project.getSourceFiles().forEach((singSourceFile) => {

    const classes = singSourceFile.getClasses();

    classes.forEach((singClass) => {
        // We check if it is the class we want to rename
        if (singClass.getName())
        {

            serverAPIFileGenerator.generateServerApiFiles(singSourceFile, singClass);

        }
    });

});