import {IFileGeneratorOptions} from '@urbanshona/common-cli';


export enum GraphQLObjectType {
    argType = 'a',
    inputType = 'i',
    objectType = 'o'
}

export interface IServerApiFileGeneratorOptions extends IFileGeneratorOptions
{
    sourceFilePathGlob: string,
    outputRootPath: string,
}
export interface IStackSynergyConfig
{
    globalOptions: IServerApiFileGeneratorOptions;
    outputClasses: IDecoratorOptions[];
}

export interface IDecoratorOptions
{
    className?: string;
    filePath?: string;
    isToAddClassValidatorDecorators: boolean;
    isToAddNestJSGraphQLDecorators: boolean;
    isEverythingOptional: boolean;
    graphqlObjectType: GraphQLObjectType;
    hasNoProperties?: boolean;

}

export const knownPrimitiveTypes = {

    integers: ['int'],
    strings: ['varchar', 'text', 'decimal'],
    dates: ['datetime'],
    booleans: ['tinyint'],
    floats: ['']

}