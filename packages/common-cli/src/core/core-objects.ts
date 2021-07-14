import {IndentationText, NewLineKind, QuoteKind} from 'ts-morph';

/**
 * Convinience enum for passing in file naming styles
 * from the command line. These file naming styles
 * are used by the File Generator and its subclasses
 * to generate files
 */
export enum FileNameType
{
    snakeCase = 's',
    kebabCase = 'k',
    camelCase = 'c',
    pascalCase = 'p',
    leaveAsIs = 'a'

}

/**
 * Convinience interface for passing
 *in settings for the File Generator over
 * the command line
 */
export interface IFileGeneratorOptions
{
    sourceFilePathGlob: string;
    outputRootPath: string;
    /// "two" or "four" or "eight" or "tab"
    indentationText: string;

    /// n for new line or c for carriage return
    lineFeedKind: string;

    isToSingleQuotes: boolean;

    isToUsePrefixAndSuffixTextForRename: boolean;
    isToUseTrailingCommas: boolean;
    fileNameType: FileNameType;

}

/**
 * Converter Object that acts as an adaptor
 * between the options passed in via the
 * command line and the manipulator
 * settings expected by ts-morph
 * objects
 */
export class FileGeneratorSettings {
    indentationText = IndentationText.FourSpaces;
    lineFeedKind = NewLineKind.LineFeed;
    quoteKind = QuoteKind.Double;
    isToUsePrefixAndSuffixTextForRename = false;
    isToUseTrailingCommas = false;

    static fromOptions(options: IFileGeneratorOptions) {
        const settings = new FileGeneratorSettings();

        settings.indentationText = this.toIndentationText(options.indentationText);
        settings.lineFeedKind = options.lineFeedKind.toLowerCase() === 'n' ? NewLineKind.LineFeed : NewLineKind.CarriageReturnLineFeed;
        settings.quoteKind = options.isToSingleQuotes ? QuoteKind.Single : QuoteKind.Double;
        settings.isToUsePrefixAndSuffixTextForRename = options.isToUsePrefixAndSuffixTextForRename;
        settings.isToUseTrailingCommas = options.isToUseTrailingCommas;

        return settings;
    }

    /**
     * Converts the convinience option for indentation into the
     * form expected by the ts-morph Project options object
     * @param optionsText
     */
    static toIndentationText(optionsText: string): IndentationText
    {
        if(optionsText === 'two')
        {
            return IndentationText.TwoSpaces;

        } else if (optionsText === 'four')
        {
            return IndentationText.FourSpaces;

        }else if (optionsText === 'eight')
        {
            return IndentationText.EightSpaces;

        }else if (optionsText === 'tab')
        {
            return IndentationText.Tab;

        }

        return IndentationText.FourSpaces;

    }
}