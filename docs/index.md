---
layout: page
published: true
# @jekyll-seo-tag
# Settings for @jekyll-seo-tag - https://github.com/jekyll/jekyll-seo-tag
title: Stack Synergy CLI
description: A boilerplate template to set up Jekyll 4 on a free 
             Heroku server. Included are additional Jekyll plugins to 
             showcase the full capabailities and it comes with an elegantly
             designed and crafted Material Design Lite theme. 
author: justinhartman
lang: en_GB
# Materialize Theme Settings
# Settings for MDL theme - https://github.com/chromatical/jekyll-materialdocs
menu: Home # Use this as the menu item text instead of title, set to false
           # to remove completely from menu.
tab: false # 'true' opens this page in a new tab.
#parent: index.md # Will make this menu item a child of the index.md item.
weight: 0 # Lower weights rise to the top of the side navigation menu.
#mdl_colors: deep_orange-blue # Override global color scheme for this page.
search: true # 'false' hides this page from search results.
image: https://picsum.photos/id/580/1200/630.jpg
# Settings for @jekyll-sitemap - https://github.com/jekyll/jekyll-sitemap
sitemap:
    changefreq: weekly
    priority: 1.0
# Settings for @jekyll-last-modified-at
# https://github.com/gjtorikian/jekyll-last-modified-at
# Comment out if you want Jekyll to automatically set the last_modified date.
last_modified_at: 2021-05-31 11:13:22 +02:00
# @jekyll-redirect-from - https://github.com/jekyll/jekyll-redirect-from
# Uncomment below to setup redirects from old pages to new ones. Useful when 
# changing page URLs; else, not needed.
# redirect_from:
#   - /post/123456789/
#   - /post/123456789/my-amazing-post/
# Settings for @jekyll-paginate-v2
# https://github.com/sverrirs/jekyll-paginate-v2
pagination:
  enabled: true
---
  
## Stack Synergy CLI 
<span class="badge-patreon">    
<a href="https://www.patreon.com/desmondrg" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a>    
</span>    

<span class="badge-opencollective">    
<a href="https://opencollective.com/stack-synergy" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a>    
</span>    
<span class="badge-buymeacoffee">    
<a href="https://ko-fi.com/desmondrg" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>    
</span>      
            
            
![GitHub stars](https://img.shields.io/github/stars/appsynergica/stack-synergy-cli?style=social) ![GitHub forks](https://img.shields.io/github/forks/appsynergica/stack-synergy-cli?style=social) ![GitHub watchers](https://img.shields.io/github/watchers/appsynergica/stack-synergy-cli?style=social)          ![GitHub followers](https://img.shields.io/github/followers/appsynergica?style=social)            
            
              
Stack Synergy CLI is a mono-repository of tools that aim to stream line the process of creating MEAN Stack / MyEAN Stack Web Applications. The repository contains the following tools:        
              
- [Browsifier](https://github.com/appsynergica/stack-synergy-cli/tree/master/packages/browsifier) :  A Command Line Application for generating Typescript classes without decorators from TypeORM Entity definitions. This solves a problem where TypeORM Entities cannot be imported into browser apps Like Angular Applications because they use webpack which bundles things and TypeORM doesn't work well with bundling.          
          
- [Graphqlizer](https://github.com/appsynergica/stack-synergy-cli/tree/master/packages/graphqlizer) : A Command Line App for adding "code first" nestjs graphql decorators and or class validator decorators to TypeORM entities.             
           
- [Nestifier](https://github.com/appsynergica/stack-synergy-cli/tree/master/packages/nestifier): A Command Line Interface for generating NestJS Feature Modules from a set of templates in a specified folder. The generated NestJS Feature Module folder will contain a service, service.spec, module, controller or controller.spec fully populated with broiler plate code that matches the logic of other similar feature modules located in the application.            
          
- [Stack Synergy](https://github.com/appsynergica/stack-synergy-cli/tree/master/packages/stack-synergy): A Command Line Interface that combines all the other tools above and adds a console GUI enquirer prompt for a more seamless programming experience          
    
 ![GitHub repo size](https://img.shields.io/github/repo-size/appsynergica/stack-synergy-cli?style=plastic) ![GitHub language count](https://img.shields.io/github/languages/count/desmondrg/stack-synergy-cli?style=plastic) ![GitHub top language](https://img.shields.io/github/languages/top/desmondrg/stack-synergy-cli?style=plastic) ![GitHub last commit](https://img.shields.io/github/last-commit/desmondrg/stack-synergy-cli?color=red&style=plastic)            
            
            
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
<a href="https://ko-fi.com/desmondrg" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>    
</span>
