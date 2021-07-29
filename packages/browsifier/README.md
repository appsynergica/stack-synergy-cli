# Urban Shona Browsifier

<span class="badge-patreon">
<a href="https://patreon.com/desmondrg" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a>
</span>
<span class="badge-opencollective">
<a href="https://opencollective.com/desmondrg" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a>
</span>
<span class="badge-buymeacoffee">
<a href="https://buymeacoffee.com/desmondrg" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>
</span>
    

![GitHub stars](https://img.shields.io/github/stars/desmondrg/stack-synergy-cli?style=social) ![GitHub forks](https://img.shields.io/github/forks/desmondrg/stack-synergy-cli?style=social) ![GitHub watchers](https://img.shields.io/github/watchers/desmondrg/stack-synergy-cli?style=social)          ![GitHub followers](https://img.shields.io/github/followers/desmondrg?style=social)


> A Command Line Application for generating Typescript classes without decorators from TypeORM Entity definitions. 
> This solves a problem where TypeORM Entities cannot be imported into browser apps Like Angular Applications because they use webpack which bundles things and TypeORM doesn;t work well with bundling.  

## Installation

```shell
npm i @desmondrg/browsifier
```

## Usage

```shell
browsifier -s [Input] -o [Output] -q [Quote]

Options:
 --help                Show help
--version              Show version number

-s, --source           The Folder Containing TypeORM Entity Classes written in Typescript [string]
                       default: {process.cwd}/server/core/database/entities

-o, --output           The Folder to place generated classes that have been stripped of   [string]
                       Typeorm Decorators/ import statments (i.e browsified)
                       default: {process.cwd}/src/app/core/database/entities


-n, --name             The naming style of the output file                                [string]
                       The default naming style is Pascal Case.
                       eg   -n k (for Kebab Case) 
                       p : Pascal
                       s : Snake Case
                       c : Camel Case
                       k : Kebab Case
                       a : Leave As Is
                       default : a

-q, --quote           Whether to use single or double quotes for import statments        [boolean]
                      in the generated classes, where true means, yes, use single
                      quotes for import statments
                      default: true

-i, --indent          The Number of spaces to indent text by : two|four|eight|tab         [string]
                      default : four         
                       
-f, --feed            Whether to use the new line character or the carriage return        [string]
                      for the line feed : n|c
                      default: n        

-c, --comma            Whether to use trailing commas or not                              [boolean]
                       default: false

-p, --prefix           Whether to use prefix and suffix text for rename                   [boolean] 
                       default: false

```

## Example

```shell

e.g browsifier -s server/entities -o browser/entities -q true

```

<p>
<a href="https://www.facebook.com/Urban-Shona-Tech-108261054866985/"><img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" height=25></a> 
</p>

<span class="badge-patreon">
<a href="https://patreon.com/desmondrg" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a>
</span>
<span class="badge-opencollective">
<a href="https://opencollective.com/desmondrg" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a>
</span>
<span class="badge-buymeacoffee">
<a href="https://buymeacoffee.com/desmondrg" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>
</span>