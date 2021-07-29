---
layout: page
published: true
title: Project Changelog
description: "A description for the about page which appears in SEO."
author: desmondrg
lang: en_GB
# Sidebar Navigation Settings.
menu: Changelog # Set to false to hide from the menu completely.
weight: 4 # Lower weights rise to the top of the side navigation menu.
# Override global color scheme for this page. 
# https://getmdl.io/customize/index.html
mdl_colors: yellow-green
search: true # 'false' hides this page from search results.
# Add the category this page should belong to.
# When set, the permalink is made up of /:category/:title (e.g. /pages/about)
category: pages
# This sets a Hero image which displays above the first line of content.
# Images should be 666px width and 350px height. If you need to change this you
# will need to edit the code in '_layouts/page.html'.
# Make "image:false" if you don't want an image to display.
image: https://picsum.photos/666/350.jpg
# Settings for @jekyll-paginate-v2
# https://github.com/sverrirs/jekyll-paginate-v2
pagination:
    enabled: true
# Sitemap Settings.
sitemap:
    changefreq: monthly
    priority: 1.0
---
## 📝 Project Changelog

Below is a detailed Changelog, along with specific tasks completed, for each
version released to date for the Stack Synergy CLI Project.

### ⌛️ Version 0.0.1 (14/07/2021)
- [🐛 #bugfix](#bugfix)
    - fixed a bug in the [Graphqlizer][GraphqlizerGit] where the IsArray [Class Validator][ClassValidatorNpm] Decorator was being added twice for some properties.
    - fixed some errors in the root `README.md` file
- [👍 #enhancement](#enhancement)
    - added code to add a white space between properties emitted by the [Browsifier][BrowsifierGit]
- [🔆 #new](#new)
    - Initial Commit : Merged the [Browsifier][BrowsifierGit] and the [Graphqlizer][GraphqlizerGit] into a single repository

[blog]: https://blog.heroku.com/using-http-headers-to-secure-your-site
[theme]: https://github.com/chromatical/jekyll-materialdocs
[jekyll-v3]: https://github.com/justinhartman/jekyll-heroku-starter-kit/tree/jekyll-v3
[mdl]: https://getmdl.io/

[BrowsifierGit]: https://github.com/desmondrg/stack-synergy-cli/tree/master/packages/browsifier
[GraphqlizerGit]: https://github.com/desmondrg/stack-synergy-cli/tree/master/packages/graphqlizer
[ClassValidatorNpm]: https://www.npmjs.com/package/class-validator
