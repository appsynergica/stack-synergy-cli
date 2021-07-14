import {
    GraphQLObjectType,
    IDecoratorOptions,
    IGraphqlsifierConfig,
} from '../core-gen';
import {
    ClassDeclaration,
    ImportDeclaration,
    PropertyDeclaration,
    SourceFile,
    Type,
    Symbol, Structure
} from 'ts-morph';
import Mustache from 'mustache';
import _ from 'lodash';
import {FileGenerator, logger} from '@urbanshona/common-cli';
logger.context = 'Graphqlsifier';

// disable html escaping for Mustache
Mustache.escape = (value) => value;

export class GenSymbolInfo {

    constructor(public path = '',
                public typeName = '',
                public isArray = false) {}
}


export class ServerAPIFileGenerator extends FileGenerator
{

    constructor(public config: IGraphqlsifierConfig)
    {
        super(config.globalOptions);

    }

    createOutputFile(sourceFile: SourceFile, sourceClass: ClassDeclaration, filePathTemplate: string): SourceFile
    {
       // const pathOfFile = `${this.rootOutputDir}/${this.toStandardFileNamePrefix(sourceClass.getName())}.ts`;

        const pathOfFile = this.renderedClassPath(sourceClass.getName(), filePathTemplate);

        // create input files from entities
        const outputFile = this.project.createSourceFile(pathOfFile, {
        }, { overwrite: true });

        // copy typeorm imports
        const sourceImportDeclarationTypeORM = sourceFile.getImportDeclaration(x => x.getModuleSpecifierValue() === 'typeorm');


        // ensures the typeorm import is added only once perfile
        // just incase this fxn is called more than once for some reason
        const importDeclarationTypeORM = this.addImportDeclaration(outputFile, 'typeorm');

        sourceImportDeclarationTypeORM.getNamedImports().forEach( x => {

            this.addNamedImport(importDeclarationTypeORM, x.getName())
        });

        // outputFile.addImportDeclaration(importDeclarationTypeORM.getStructure());
        //

        return outputFile;
    }

    generateServerApiFiles(sourceFile: SourceFile, sourceClass: ClassDeclaration)
    {


         const groupedOutputClasses = _.groupBy(this.config?.outputClasses, 'filePath');

         // get each grouping filepath key and loop
        //
        Object.keys(groupedOutputClasses).forEach( singOutputPathTemplate => {

            // create an output file for each output paath

           const outputFile = this.createOutputFile(sourceFile, sourceClass, singOutputPathTemplate);

            // get the array of grouped file output options for each class
            const outputOptionsArray = groupedOutputClasses[singOutputPathTemplate];

            // create classes for each grouped option
            outputOptionsArray?.forEach(singOption => {

                //give the properities to the output file
                const defaultClass =  outputFile.addClass({
                    name: this.renderedClassName(sourceClass.getName(), singOption),
                    isExported: sourceClass.isExported()
                });

                this.addClassValidatorOrNestJSDecorators(sourceFile, sourceClass, defaultClass, outputFile, singOption);

                logger.log(`${sourceClass.getName()} --> ${outputFile?.getFilePath()}`);
            });

            outputFile.save();


        });

        // this.config.outputClasses.forEach( singOption => {
        //
        //
        //
        //
        // });


    }



    // @ts-ignore
    addClassValidatorOrNestJSDecorators(sourceFile: SourceFile,
                                        sourceClass: ClassDeclaration,
                                        destinationClass: ClassDeclaration,
                                        destinationFile: SourceFile,
                                        options: IDecoratorOptions)
    {

        //add file imports

        const importDeclarationClassValidator =  this.addImportDeclaration(destinationFile, 'class-validator');
        const importDeclarationNestGraphQL = this.addImportDeclaration(destinationFile, '@nestjs/graphql');
        const importDelcarationClassTransformer = this.addImportDeclaration(destinationFile, 'class-transformer');



        //add class decortor

        if(options.isToAddNestJSGraphQLDecorators)
        {
            switch(options.graphqlObjectType)
            {
                case GraphQLObjectType.argType:

                    this.addNamedImport(importDeclarationNestGraphQL, 'ArgType');

                    destinationClass.addDecorator({
                        name: "ArgType",
                        arguments: []
                    });
                    break;
                case GraphQLObjectType.inputType:

                    this.addNamedImport(importDeclarationNestGraphQL, 'InputType');

                    destinationClass.addDecorator({
                        name: "InputType",
                        arguments: []
                    });
                    break;
                case GraphQLObjectType.objectType:

                    this.addNamedImport(importDeclarationNestGraphQL, 'ObjectType');

                    destinationClass.addDecorator({
                        name: "ObjectType",
                        arguments: []
                    });
                    break;

            }
        }


        // traverse each property adding class validator and graphql validators
        if(!options.hasNoProperties)
        {
            sourceClass.getProperties().forEach( singProperty => {

                const singPropertyStruct = {... singProperty.getStructure()};

                delete singPropertyStruct.decorators;

                // create a corresponding property without source property decorators
                // these source decorators will be added last
                const destProperty = destinationClass.addProperty(singPropertyStruct);

                // @ts-ignore
                singProperty.getDecorators().forEach((singDecorator, index, array) => {

                    //console.log('\n\nProperty : ' + JSON.stringify(singProperty.getStructure(), null, 2));
                    //console.log('\n\nDecorator : ' + JSON.stringify(singDecorator.getStructure(), null, 2));

                    if(singDecorator.getName() === 'PrimaryGeneratedColumn')
                    {
                        this.addPropertyDecorator(destProperty,
                            false,
                            'IsInt',
                            [],
                            'ID',
                            importDeclarationClassValidator,
                            importDeclarationNestGraphQL,
                            importDelcarationClassTransformer,
                            options);

                    }else{

                        const propType = singProperty.getType();

                        const propInfo = this.getTypeInfo(propType, options);

                        if(options.isToAddClassValidatorDecorators && (options.isEverythingOptional || propType.isNullable()))
                        {
                            destProperty.addDecorator({
                                name: "IsOptional",
                                arguments: [],
                            });
                        }


                        if(!propType.isArray()) // Non Array Types
                        {

                            if(propType.isString())
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsString',
                                    [],
                                    'String',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                            }else if(propType.isBoolean())
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsBoolean',
                                    [],
                                    'Boolean',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                                // TODO: Seperate Int from Float
                            }else if(propType.isNumber()) // Int
                            {

                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsNumber',
                                    [],
                                    'Float',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                                // TODO: Seperate Int from Float
                            }else if(propType.isNumber()) // Float
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsInt',
                                    [],
                                    'Int',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);
                            }else if(propType.isObject()) // Object
                            {

                                // add custom import


                                const importDeclarationCustomType = this.addImportDeclaration(destinationFile, propInfo.path);

                                this.addNamedImport(importDeclarationCustomType, propInfo.typeName);

                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    null,
                                    null,
                                    propInfo.typeName,
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options,
                                    false,
                                    true);
                            }



                        }else if(propType.isArray()) // Array Types
                        {
                            destProperty.addDecorator({
                                name: "IsArray",
                                arguments: []
                            });

                            if(propType.isString())
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsString',
                                    [`{each: true}`],
                                    'String',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                            }else if(propType.isBoolean())
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsBoolean',
                                    [],
                                    'Boolean',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options,
                                    true);

                                // TODO: Seperate Int from Float
                            }else if(propType.isNumber()) // Int
                            {

                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsNumber',
                                    [`{each: true}`],
                                    'Float',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                                // TODO: Seperate Int from Float
                            }else if(propType.isNumber()) // Float
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsInt',
                                    [],
                                    'Int',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options,
                                    true);
                            }else if(propType.isObject()) // Object
                            {

                                // add custom import


                                const importDeclarationCustomType = this.addImportDeclaration(destinationFile, propInfo.path);

                                this.addNamedImport(importDeclarationCustomType, propInfo.typeName);

                                // TODO: Add Actual Custom Object Field Type
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    null,
                                    null,
                                    propInfo.typeName,
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options,
                                    true,
                                    true);
                            }


                        }
                    }



                    //  if(singDecorator.getName() === 'Column')
                    // {
                    //     // singDecorator.getArguments().forEach( singDecoratorArg => console.log(singDecoratorArg));
                    //
                    // }else if(singDecorator.getName() === 'ManyToOne')
                    // {
                    //
                    // }else if(singDecorator.getName() === 'JoinColumn')
                    // {
                    //
                    // }else if(singDecorator.getName() === 'OneToMany')
                    // {
                    //
                    // }

                    // add a property with a new line except for the last property


                    // finally add the source file decorators
                    destProperty.addDecorators(singProperty.getDecorators().map(x => x.getStructure()));


                    // console.log(index);
                    // console.log(array);

                    // if(index !== (array.length - 1))
                    // {


                    //destProperty.appendWhitespace(x => x.newLine());
                    // destinationClass.addProperty(singProperty.getStructure());

                    // }else{
                    //     destinationClass.addProperty(singProperty.getStructure());
                    // }



                });






            });
        }

        // add spaces between properties

        const addedProperties = destinationClass.getProperties();

        // append a newline to every added property, except the last one which is at the end of the class
        addedProperties.slice(0, -1).forEach(x => x.appendWhitespace(y => {
            y.newLine();
        }));

    }



    addImportDeclaration(sourceFile: SourceFile, moduleSpecifier: string)
    {
        const declaration = sourceFile.getImportDeclaration(x => x.getModuleSpecifierValue() === moduleSpecifier);

        if(declaration)
        {
            return declaration;
        }

        return sourceFile.addImportDeclaration({
            moduleSpecifier
        });
    }

    addNamedImport(declaration: ImportDeclaration, importName: string)
    {
        const namedImport = declaration.getNamedImports()?.find(x => x?.getName() === importName);

        if(namedImport)
        {
            return namedImport;
        }

       return declaration.addNamedImport(importName);

    }

    addPropertyDecorator(singProperty: PropertyDeclaration,
                         isNullable: boolean,
                         classValidatorDecorator: string,
                         classValidatorDecoratorArgs: string[],
                         fieldType: string,
                         importDeclationClassValidator: ImportDeclaration,
                         importDeclationNestJS: ImportDeclaration,
                         importDeclarationClassTransformer: ImportDeclaration,
                         options: IDecoratorOptions,
                         isToAddClassValidatorArrayTag = false,
                         isPropertyObjectType = false)
    {

        if(options.isToAddClassValidatorDecorators)
        {

            if(classValidatorDecorator?.length)
            {

                this.addNamedImport(importDeclationClassValidator, classValidatorDecorator);


                singProperty.addDecorator({
                    name: classValidatorDecorator,
                    arguments: classValidatorDecoratorArgs ?? [],
                });
            }

            if(isToAddClassValidatorArrayTag)
            {

                this.addNamedImport(importDeclationClassValidator, 'IsArray');


                singProperty.addDecorator({
                    name: 'IsArray',
                    arguments: [],
                });

            }

            if(isPropertyObjectType)
            {

                this.addNamedImport(importDeclationClassValidator, 'ValidateNested');

                if(isToAddClassValidatorArrayTag) // array of objects
                {

                    singProperty.addDecorator({
                        name: 'ValidateNested',
                        arguments: [`{each: true}`],
                    });

                }else{


                    singProperty.addDecorator({ // just an object not an array
                        name: 'ValidateNested',
                        arguments: [],
                    });

                }

                this.addNamedImport(importDeclarationClassTransformer, 'Type');
                
                singProperty.addDecorator({
                    name: 'Type',
                    arguments: [`() => ${fieldType}`],
                });

            }




        }
        if(options.isToAddNestJSGraphQLDecorators)
        {
            this.addNamedImport(importDeclationNestJS, 'Field');

            if(['ID', 'Int', 'Float'].includes(fieldType))
            {
                this.addNamedImport(importDeclationNestJS, fieldType);
            }

            if(isNullable) // Nullable
            {
                singProperty.addDecorator({
                    name: "Field",
                    arguments: [`type => ${fieldType}`, `{nullable: true}`],
                });
            }else{ // Not nullable
                singProperty.addDecorator({
                    name: "Field",
                    arguments: [`type => ${fieldType}`, `{nullable: false}`],
                });
            }
        }
    }


    getInfoFromSymbol(symbol: Symbol, options: IDecoratorOptions):  GenSymbolInfo
    {
        let obj = new GenSymbolInfo();

        obj.typeName = this.renderedClassName(symbol?.getName(), options);

        // symbol?.getDeclarations()?.map(d => {
        //     obj.path = this.renderedClassPath(d.getSourceFile().getFilePath(), options);
        // });

        obj.path = this.renderedClassPath(obj.typeName, options.filePath);




        return obj;
    }

    // @ts-ignore
    getTypeInfo(propType: Type, options: IDecoratorOptions): GenSymbolInfo
    {


       let obj = this.getInfoFromSymbol(propType?.getSymbol(), options);


        if(obj.typeName === 'Array')
        {

            obj =  this.getInfoFromSymbol(propType?.getArrayElementType()?.getSymbol(), options);
            obj.isArray = true;
        }

        // console.log('pep 122' + JSON.stringify(obj, null, 2));

        return obj;
    }

    addLeadingNewline<T extends Structure>(structure: T)
    {
        structure.leadingTrivia = writer => writer.newLine();
        return structure;
    }

    addTrailingNewline<T extends Structure>(structure: T)
    {
        structure.trailingTrivia = writer => writer.blankLine();
        return structure;
    }

    private renderedClassName(name: string, options: IDecoratorOptions)
    {
        return Mustache.render(options.className, {sourceClassName: name});
    }

    // @ts-ignore
    private renderedClassPath(sourceClassName: string, filePathTemplate: string)
    {
        return Mustache.render(filePathTemplate, {outputRootPath: this.config.globalOptions.outputRootPath, sourceClassName: this.toStandardFileNamePrefix(sourceClassName)});
    }


    // private appendNewLine(node: Node)
    // {
    //     node.appendWhitespace(writer => writer.newLine());
    // }
}