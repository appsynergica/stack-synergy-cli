import {
    GraphQLObjectType,
    IDecoratorOptions,
    IGraphqlizerConfig,
    knownPrimitiveTypes,
} from '../core-gen';
import {
    ClassDeclaration,
    ImportDeclaration,
    PropertyDeclaration,
    SourceFile,
    Type,
    Symbol, Structure, Decorator,
    StringLiteral,
    ObjectLiteralExpression, OptionalKind, DecoratorStructure
} from 'ts-morph';
import Mustache from 'mustache';
import _ from 'lodash';
import {FileGenerator, logger} from '@urbanshona/common-cli';
logger.context = 'Graphqlizer';

// disable html escaping for Mustache
Mustache.escape = (value) => value;

export class GenSymbolInfo {

    constructor(public path = '',
                public typeName = '',
                public isArray = false) {}
}

export enum PrimitiveTypeName
{
    Int = 'Int',
    Float = 'Float',
    String = 'String',
    ID = 'ID',
    Bool = 'BOOL',
    Date = 'Date',
    NoType = 'NoType'
}

export class PrimitiveTypeInfo {

    constructor(public typeName = PrimitiveTypeName.NoType,
                public isArray = false) {}
}


export class ServerAPIFileGenerator extends FileGenerator
{

    constructor(public config: IGraphqlizerConfig)
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


        // TODO: copy typeorm imports under a condition of whether to add typeorm decorators or not
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

                // TODO: Add TypeORM Decorators at the end under a condition of whether to add typeorm decorators or not
                delete singPropertyStruct.decorators;

                // create a corresponding property without source property decorators
                // these source decorators will be added last
                const destProperty = destinationClass.addProperty(singPropertyStruct);

                // @ts-ignore
                singProperty.getDecorators().forEach((singDecorator, index, array) => {

                    //console.log('\n\nProperty : ' + JSON.stringify(singProperty.getStructure(), null, 2));
                    //console.log('\n\nDecorator : ' + JSON.stringify(singDecorator.getStructure(), null, 2));


                    // singDecorator.getArguments().forEach( singDecoratorArg => console.log(singDecoratorArg));


                        const propType = singProperty.getType();

                        const propPrimitiveInfo = this.getPrimitiveTypeInfo(singDecorator);

                        const propReferenceInfo = this.getReferenceTypeInfo(propType, options);

                    // TODO: Confirm whether MongoDB ObjectIDs are ALWAYS numberic & fix the if else logic accordingly
                    if(singDecorator.getName() === 'PrimaryGeneratedColumn' || singDecorator.getName() === 'PrimaryColumn' || singDecorator.getName() === 'ObjectIdColumn') // PRIMARY 
                    {
                        this.addPropertyDecorator(destProperty,
                            false,
                            propType.isString() ? 'IsString' : 'IsInt',
                            [],
                            'ID',
                            importDeclarationClassValidator,
                            importDeclarationNestGraphQL,
                            importDelcarationClassTransformer,
                            options);

                    }else if(singDecorator.getName() === 'CreateDateColumn' || singDecorator.getName() === 'UpdateDateColumn' || singDecorator.getName() === 'DeleteDateColumn') // DATE
                    {
                        this.addPropertyDecorator(destProperty,
                            false,
                            'IsDate',
                            [],
                            'Date',
                            importDeclarationClassValidator,
                            importDeclarationNestGraphQL,
                            importDelcarationClassTransformer,
                            options);

                    }

                    else{

                        

                        if(options.isToAddClassValidatorDecorators && (options.isEverythingOptional || propType.isNullable()))
                        {
                            destProperty.addDecorator({
                                name: "IsOptional",
                                arguments: [],
                            });
                        }


                        if(!propType.isArray()) // Non Array Types
                        {

                            if(propType.isString() || propPrimitiveInfo.typeName === PrimitiveTypeName.String)
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsString',
                                    [],
                                    'String',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                            }else if(propType.isBoolean() || propPrimitiveInfo.typeName === PrimitiveTypeName.Bool)
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
                            }else if((propType.isNumber() && propPrimitiveInfo.typeName === PrimitiveTypeName.Int) || propPrimitiveInfo.typeName === PrimitiveTypeName.Int) // Int
                            {

                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsInt',
                                    [],
                                    'Int',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);

                                // TODO: Seperate Int from Float
                            }else if(singDecorator.getName() === 'VersionColumn' || (propType.isNumber() && propPrimitiveInfo.typeName === PrimitiveTypeName.Float) || propPrimitiveInfo.typeName === PrimitiveTypeName.Float) // Float
                            {
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    'IsNumber',
                                    [],
                                    'Float',
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options);
                            }else if(propType.isObject()) // Object
                            {

                                // add custom import


                                const importDeclarationCustomType = this.addImportDeclaration(destinationFile, propReferenceInfo.path);

                                this.addNamedImport(importDeclarationCustomType, propReferenceInfo.typeName);

                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    null,
                                    null,
                                    propReferenceInfo.typeName,
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options,
                                    false,
                                    true);
                            }



                        }else if(propType.isArray()) // Array Types
                        {


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

                            }else if(propType.isObject()) // Object
                            {

                                // add custom import


                                const importDeclarationCustomType = this.addImportDeclaration(destinationFile, propReferenceInfo.path);

                                this.addNamedImport(importDeclarationCustomType, propReferenceInfo.typeName);

                                // TODO: Add Actual Custom Object Field Type
                                this.addPropertyDecorator(destProperty, propType.isNullable() || options.isEverythingOptional,
                                    null,
                                    null,
                                    propReferenceInfo.typeName,
                                    importDeclarationClassValidator,
                                    importDeclarationNestGraphQL,
                                    importDelcarationClassTransformer,
                                    options,
                                    true,
                                    true);
                            }


                        }
                    }


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

    addDecorator(property: PropertyDeclaration, structure: OptionalKind<DecoratorStructure>): Decorator
    {
        const existingDecorator = property.getDecorators()?.find(x => x?.getName() === structure.name);

        if(existingDecorator)
        {
            return existingDecorator;
        }

        return property.addDecorator(structure);
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


                this.addDecorator(singProperty,
                    {
                    name: classValidatorDecorator,
                    arguments: classValidatorDecoratorArgs ?? [],
                });
            }

            if(isToAddClassValidatorArrayTag)
            {

                this.addNamedImport(importDeclationClassValidator, 'IsArray');


                this.addDecorator(singProperty,
                    {
                    name: 'IsArray',
                    arguments: [],
                });

            }

            if(isPropertyObjectType)
            {

                this.addNamedImport(importDeclationClassValidator, 'ValidateNested');

                if(isToAddClassValidatorArrayTag) // array of objects
                {

                    this.addDecorator(singProperty,
                        {
                        name: 'ValidateNested',
                        arguments: [`{each: true}`],
                    });

                }else{


                    this.addDecorator(singProperty,
                        { // just an object not an array
                        name: 'ValidateNested',
                        arguments: [],
                    });

                }

                this.addNamedImport(importDeclarationClassTransformer, 'Type');
                
                this.addDecorator(singProperty,
                    {
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
                this.addDecorator(singProperty,
                    {
                    name: "Field",
                    arguments: [`type => ${fieldType}`, `{nullable: true}`],
                });
            }else{ // Not nullable
                this.addDecorator(singProperty,
                    {
                    name: "Field",
                    arguments: [`type => ${fieldType}`, `{nullable: false}`],
                });
            }
        }
    }


    setPrimitiveType(obj: PrimitiveTypeInfo, probingRawTypeName: string)
    {
        if( knownPrimitiveTypes.integers.includes(probingRawTypeName?.toLowerCase())) // INT
        {
            obj.typeName = PrimitiveTypeName.Int;
        }
        else if( knownPrimitiveTypes.floats.includes(probingRawTypeName?.toLowerCase())) // FLOAT
        {
            obj.typeName = PrimitiveTypeName.Float;
        }
        else if( knownPrimitiveTypes.strings.includes(probingRawTypeName?.toLowerCase())) // STRING
        {
            obj.typeName = PrimitiveTypeName.String;
        }
        else if( knownPrimitiveTypes.booleans.includes(probingRawTypeName?.toLowerCase())) // BOOLEAN
        {
            obj.typeName = PrimitiveTypeName.Bool;

        }
        else if( knownPrimitiveTypes.dates.includes(probingRawTypeName?.toLowerCase())) // DATES
        {
            obj.typeName = PrimitiveTypeName.Date;
        }

        return obj.typeName !== PrimitiveTypeName.NoType;
    }


    getPrimitiveTypeInfo(decorator: Decorator): PrimitiveTypeInfo
    {
        let obj = new PrimitiveTypeInfo();

        let hasFoundPrimitiveType = false;

        if(decorator.getName() === 'Column')
        {
            decorator.getArguments().forEach(singArg => {


               
               //String Literal Expression

              if(singArg instanceof StringLiteral && singArg?.getLiteralValue())
              {

                
                const stringValue = singArg?.getLiteralValue();

                hasFoundPrimitiveType = this.setPrimitiveType(obj, stringValue);

               // console.log(`String value : ${stringValue} hasFoundPrimitiveType: ${hasFoundPrimitiveType} ${JSON.stringify(obj, null, 2)}`);


              }

            //Object Literal Expression

            else if(singArg instanceof ObjectLiteralExpression && singArg?.getProperties())
            {
                const targetLiteralPropKey = 'type';

                const typeORMTypeArg = singArg.getProperty(targetLiteralPropKey);

                
                // only search for the type in the second decorator args parameter if 
                // the type hasnt been found in the first args
                if(typeORMTypeArg && !hasFoundPrimitiveType)
                {
                    // console.log(`typeorm type arg found : `);


                    // get text returns the property as "type: int" therefore replace and trim accordingly
                    const filteredLiteralValue = typeORMTypeArg.getText()?.replace(targetLiteralPropKey, '')?.replace(':', '')?.trim();

                   // console.log(filteredLiteralValue);

                     hasFoundPrimitiveType = this.setPrimitiveType(obj, filteredLiteralValue);


                }


            }


            });

           
        }


        return obj;
    }



    // @ts-ignore
    getReferenceTypeInfo(propType: Type, options: IDecoratorOptions): GenSymbolInfo
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

        getInfoFromSymbol(symbol: Symbol, options: IDecoratorOptions):  GenSymbolInfo
    {
        let obj = new GenSymbolInfo();

        const sourcePathName = symbol?.getName();
        obj.typeName = this.renderedClassName(sourcePathName, options);

        // symbol?.getDeclarations()?.map(d => {
        //     obj.path = this.renderedClassPath(d.getSourceFile().getFilePath(), options);
        // });

        // format of path "./fileName";
        obj.path = `./${this.renderedClassPath(sourcePathName, options.filePath)?.split('/')?.pop()?.replace('.ts', '')}`;




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