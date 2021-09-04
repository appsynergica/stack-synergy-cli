


# Graphqlizer

<span class="badge-patreon">
<a href="https://www.patreon.com/desmondrg" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a>
</span>
<span class="badge-opencollective">
<a href="https://opencollective.com/stack-synergy" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a>
</span>
<span class="badge-buymeacoffee">
<a href="https://buymeacoffee.com/desmondrg" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>
</span>

  

![GitHub stars](https://img.shields.io/github/stars/desmondrg/stack-synergy-cli?style=social) ![GitHub forks](https://img.shields.io/github/forks/desmondrg/stack-synergy-cli?style=social) ![GitHub watchers](https://img.shields.io/github/watchers/desmondrg/stack-synergy-cli?style=social)          ![GitHub followers](https://img.shields.io/github/followers/desmondrg?style=social)


> A Command Line App for adding "code first" nestjs graphql decorators and or class validator decorators to TypeORM entities. 

## Installation

```shell
npm i @desmondrg/graphqlizer
```

## Usage


```shell
#with custom path for graphqlizer.json :
graphqlizer -P "path/to/graphqlizer.json"
```

```shell
#with graphqlizer.json located in root folder:
graphqlizer
```


## Example # 1 : Basic Usage

The following example adds both graphql and class validator decorators to typeorm entities thereby transforming them into code first nestjs graphql object types. Since the source files and output files are the same, it will simply appear as though the respective decorators have been added to the respective typeorm entities. 

Note : it is advisable to backup entities before performing this example incase the output turns out not to be satisfactory

## Steps : 3 Only

 - **Step #1:** Add a graphqlizer.json file in the root folder of your project.
 - **Step #2:** Add the following JSON Object to graphqlizer.json :
**Note**: Don't forget step #3 (after the json object shown below)
```json

{  
    "globalOptions": {  
        "sourceFilePathGlob": "src/core/database/entities/*.ts",  
  "outputRootPath": "src",  
  "isToSingleQuotes": false,  
  "fileNameType": "t",  
  "indentationText": "two",  
  "lineFeedKind": "n",  
  "isToUseTrailingCommas": false,  
  "isToUsePrefixAndSuffixTextForRename": false  
  },  
  "outputClasses" : [  
        {  
            "className": "{{sourceClassName}}",  
  "graphqlObjectType": "o",  
  "filePath": "{{outputRootPath}}/core/database/entities/{{sourceClassName}}.ts",  
  "isEverythingOptional": false,  
  "isToAddClassValidatorDecorators": true,  
  "isToAddNestJSGraphQLDecorators": true,  
  "isToAddTypeOrmDecorators": true  
  }  
  
    ]  
}
```

 - **Step #3:** Add an npm script in package.json to call the graphqlizer or simply execute the following command in a command prompt :
```shell
#with custom path for graphqlizer.json :
graphqlizer -P "path/to/graphqlizer.json"
```
**OR**
```shell
#with graphqlizer.json located in root folder:
graphqlizer
```
## Example # 2 : Advanced Usage

The following example generates the following entities.

 - Typeorm entities with class validator entities and nestjs code first entities. These entities will overwrite the source file
 - entities without any decorators. These entities may be necessary for browser side apps as typeorm decorators are offensive to webpack. These entities will be placed in the file path : "src/core/browser/*.ts"
 - Multiple nestjs code first input type entities in the same file. These entities will have class validator decorators and nestjs code first decorators but no typeorm entities. These entities will all be placed in the same file: "src/core/graphql/*.ts". 

Note : it is advisable to backup entities before performing this example incase the output turns out not to be satisfactory

## Steps : 3 Only
 - **Step #1:** Add a graphqlizer.json file in the root folder of your project.
 - **Step #2:** Add the following JSON object to the graphqlizer.json file :
**Note**: Don't forget step #3 (after the json object shown below)

```json

{  
    "globalOptions": {  
        "sourceFilePathGlob": "src/core/database/entities/*.ts",  
  "outputRootPath": "src",  
  "isToSingleQuotes": false,  
  "fileNameType": "t",  
  "indentationText": "two",  
  "lineFeedKind": "n",  
  "isToUseTrailingCommas": false,  
  "isToUsePrefixAndSuffixTextForRename": false  
  },  
  "outputClasses" : [  
        {  
            "className": "{{sourceClassName}}",  
  "graphqlObjectType": "o",  
  "filePath": "{{outputRootPath}}/core/database/entities/{{sourceClassName}}.ts",  
  "isEverythingOptional": false,  
  "isToAddClassValidatorDecorators": true,  
  "isToAddNestJSGraphQLDecorators": true,  
  "isToAddTypeOrmDecorators": true  
  },
{
            "className": "{{sourceClassName}}",
            "graphqlObjectType": "o",
            "filePath": "{{outputRootPath}}/core/browser/entities/{{sourceClassName}}.ts",
            "isEverythingOptional": false,
            "isToAddClassValidatorDecorators": false,
            "isToAddNestJSGraphQLDecorators": false,
            "isToAddTypeOrmDecorators": false
        },
        {
            "className": "{{sourceClassName}}SearchOptions",
            "graphqlObjectType": "i",
            "filePath": "{{outputRootPath}}/core/graphql/input/{{sourceClassName}}.input.ts",
            "isEverythingOptional": true,
            "isToAddClassValidatorDecorators": true,
            "isToAddNestJSGraphQLDecorators": true,
            "isToAddTypeOrmDecorators": false,
            "hasNoProperties": true
        },
        {
            "className": "Add{{sourceClassName}}Input",
            "graphqlObjectType": "i",
            "filePath": "{{outputRootPath}}/core/graphql/input/{{sourceClassName}}.input.ts",
            "isEverythingOptional": false,
            "isToAddClassValidatorDecorators": true,
            "isToAddNestJSGraphQLDecorators": true,
            "isToAddTypeOrmDecorators": false
        },
        {
            "className": "Update{{sourceClassName}}Input",
            "graphqlObjectType": "i",
            "filePath": "{{outputRootPath}}/core/graphql/input/{{sourceClassName}}.input.ts",
            "isEverythingOptional": true,
            "isToAddClassValidatorDecorators": true,
            "isToAddNestJSGraphQLDecorators": true,
            "isToAddTypeOrmDecorators": false
        }  
  
    ]  
}
```
 - **Step #3:** Add an npm script in package.json to call the graphqlizer or simply execute the following command in a command prompt :
```shell
#with custom path for graphqlizer.json :
graphqlizer -P "path/to/graphqlizer.json"
```
**OR**
```shell
#with graphqlizer.json located in root folder:
graphqlizer
```

## Detailed Overview

Add a graphqlizer.json file in the root folder of your project. The file should contain a JSON Object with the following properties

#globalOptions
A JSON Object with the following properties
         
  - "sourceFilePathGlob" :  A glob path containing the source files 
  - "outputRootPath": The root file path to place all output
  - "isToSingleQuotes":  A boolean for whether to use single quotes or double quotes (Recommended : use double quotes)  
  - "fileNameType":  A string for the file name type :
                     "k" for kebarb case
                      "c" for camel case
                      "t"  for type case
   - "indentationText": A string for the indentation level either "two", "four" or "eight"  
  - "lineFeedKind": A string for the line feed "n" for new line, "c" for carriage return,  
  "isToUseTrailingCommas": false,  
  "isToUsePrefixAndSuffixTextForRename": false 
  
## Output classes
A JSON Array of entity generation options. The array can be used to generate multiple graphql entity types such as input types, output types and object types.  The array can even be used to specify options that can remove decorators from typeorm entities. 

**Note** : Entity generation options with the same output file name will result in multiple classes being placed in the same file. 



## Entity Generation Option
A JSON Object specifying output generation options


 - "className":  The name of the class to be generated. The class name can be generated using the following mustache variables:
      - {{sourceClassName}} : resolves to the current source entity being tranformed
 
 - "graphqlObjectType":  The nestjs Graphql type to create "o" for object type, "i" for input type,  
 - "filePath": The output file path. The path can be generated using the following mustache variables :  
     - {{outputRootPath}} : resolves to the rootpath property of the globalOptions object 
     - {{sourceClassName}} : resolves to the current source entity being tranformed
e.g of an output path :
{{outputRootPath}}/core/database/entities/{{sourceClassName}}.ts",  
   - "isEverythingOptional":  A boolean for whether to make all fields optional,  
 -  "isToAddClassValidatorDecorators":  A boolean for whether to add class validator options or not,  
  - "isToAddNestJSGraphQLDecorators": A boolean of whether to add nestjs graphql decorators or not,  
  -"isToAddTypeOrmDecorators": A boolean of whether to add typeorm decorators or not




<p>
<a href="https://www.facebook.com/Urban-Shona-Tech-108261054866985/"><img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" height=25></a> 
</p>

<span class="badge-patreon">
<a href="https://www.patreon.com/desmondrg" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a>
</span>
<span class="badge-opencollective">
<a href="https://opencollective.com/stack-synergy" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a>
</span>
<span class="badge-buymeacoffee">
<a href="https://buymeacoffee.com/desmondrg" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>
</span>