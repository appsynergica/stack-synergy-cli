import {pluralizer} from './core-plural';
import _ from 'lodash';
export class Maven
{

}

export class NameMaven extends Maven
{
    constructor(protected fileType: string, protected fileNamePrefix: string)
    {
        super();
        this.fileNamePrefix = this.fileNamePrefix.replace(this.fileType, '');
        this.fileNamePrefix = _.camelCase(this.fileNamePrefix);

        // this.logger.log(`NameMaven --> ${this.toString}`);

    }


    get standardSourceKey(): string
    {
        return pluralizer(this.fileNamePrefix);
    }

    /**
     * e.g EnglishWordSchema | TemplateSchema
     */
    get standardGeneratedClassName(): string {
        return `${this.standardEntityName}${_.upperFirst(this.fileType)}`;
    }

    /**
     * e.g template | shona_word
     */
    get standardTableName(): string
    {
        return _.snakeCase(this.fileNamePrefix).toLowerCase();
    }

    /**
     * e.g Template | ShonaWord
     */
    get standardEntityName(): string {
        return _.upperFirst(_.camelCase(this.fileNamePrefix));
    }

    /**
     * eg template | shonaWord
     */
    get standardEntityVariableName(): string
    {
        return this.fileNamePrefix;
    }


    /**
     * eg templateDao | templateSchema | templateController | shonaWordController
     */
    get standardVariableName(): string {
        return `${_.camelCase(this.fileNamePrefix)}${_.upperFirst(this.fileType)}`;
    }

    /**
     * e.g template | shona-word
     */
    get standardFileNamePrefix(): string {
        return _.kebabCase(this.fileNamePrefix).toLowerCase();
    }
    get standardTestFileNamePrefix(): string
    {
        return `${this.standardFileNamePrefix}.spec`;
    }

    /**
     * e.g template.ts | shona-word.ts
     * @param isToAddExtension whether to add a .ts at the end
     */
    standardFileName(isToAddExtension = true): string {
        return `${this.standardFileNamePrefix}.${this.fileType}${
            isToAddExtension ? '.ts' : ''
        }`;
    }

    standardTestFileName(isToAddExtension = true): string {
        return `${this.standardFileNamePrefix}.${this.fileType}.spec${
            isToAddExtension ? '.ts' : ''
        }`;
    }

    private get ucFirstName(): string {
        return _.upperFirst(this.fileNamePrefix);
    }

    get toString()
    {
        return `standardFileNamePrefix : ${this.standardFileNamePrefix} \n
       standardTestFileNamePrefix : ${this.standardTestFileNamePrefix}\n
      standardFileName           : ${this.standardFileName(true)}\n
      standardTestFileName       : ${this.standardTestFileName(true)}\n
      standardVariableName       : ${this.standardVariableName}\n
      standardEntityVariableName : ${this.standardEntityVariableName}\n
      standardGeneratedClassName : ${this.standardGeneratedClassName}\n
      standardEntityName         : ${this.standardEntityName}\n
      standardSourceKey          : ${this.standardSourceKey}\n
      `;
    }

}