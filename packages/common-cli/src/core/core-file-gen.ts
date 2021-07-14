import {Project} from 'ts-morph';
import {FileGeneratorSettings, FileNameType, IFileGeneratorOptions} from './core-objects';
import _ from 'lodash';

/**
 * Base Class For Generating Files
 * Contains a ts-morph project object for
 * typescript node manipulation and emitting
 */
export class FileGenerator
{
    public project: Project;

    /**
     * Instanciates a new File Generator
     * @param sourceFilePathGlob The Path containing the files to load into the project
     * @param fileNameType The naming type to use for the emitted files
     * @param options Options for configuring output, typically passed via the command line
     */
    constructor(public options: IFileGeneratorOptions)
    {

        const settings =  FileGeneratorSettings.fromOptions(options);

        this.project = new Project(
            {
                // these are the defaults
                manipulationSettings: {
                    indentationText: settings.indentationText,
                    newLineKind: settings.lineFeedKind,
                    quoteKind: settings.quoteKind,
                    usePrefixAndSuffixTextForRename: settings.isToUsePrefixAndSuffixTextForRename,
                    useTrailingCommas: settings.isToUseTrailingCommas,
                },
            }
        );

        if (options?.sourceFilePathGlob) {
            this.project.addSourceFilesAtPaths(options.sourceFilePathGlob);
        }


    }

    /**
     * Converts a file name to the output naming style specified
     * in the constructor of this class
     * @param probe
     */
    toStandardFileNamePrefix(probe: string) {

        switch (this.options.fileNameType)
        {
            case FileNameType.leaveAsIs:
                return probe;

            case FileNameType.kebabCase:
                return _.kebabCase(probe);

            case FileNameType.camelCase:
                return _.camelCase(probe);

            case FileNameType.pascalCase:
                return _.upperFirst(_.camelCase(probe));

            case FileNameType.snakeCase:
                return _.snakeCase(probe);
        }

        // return pascal case as default
        return _.upperFirst(_.camelCase(probe));

    }


}