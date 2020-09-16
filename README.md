<!-- Branding -->
<p align="center">
    <img src="https://imgur.com/VFbYYSa.png" width="270" alt="TheActionDev" />
</p>

<p align="center">
    <a href="https://dev.to/">dev.to</a> articles with <b>GitHub Action</b> 🧑‍💻
</p>

<!-- Badges -->
<p align="center">

  <!-- First Row -->
  <a href="https://github.com/ful1e5/TheActionDev/actions?query=workflow%3Abuild-test">
    <img alt="GitHub Action Build" src="https://github.com/ful1e5/TheActionDev/workflows/build-test/badge.svg" width="129" />
  </a>
  
  <a href="https://www.codefactor.io/repository/github/ful1e5/theactiondev">
    <img src="https://www.codefactor.io/repository/github/ful1e5/theactiondev/badge" alt="CodeFactor" />
  </a>

  <a href="https://github.com/ful1e5/TheActionDev/releases">  
    <img alt="TheActionDev Releases" src="https://img.shields.io/github/v/release/ful1e5/TheActionDev">
  </a>

  <!-- Second Row -->
  </br >
  <a href="https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html">
    <img alt="npm type definitions" src="https://img.shields.io/npm/types/typescript">
  </a>

  <a href="https://github.com/ful1e5/TheActionDev/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/ful1e5/TheActionDev?color=0081FB" />
  </a>

  <a href="https://github.com/ful1e5/TheActionDev/community">
    <img src="https://img.shields.io/badge/community%20standards-satisfied-brightgreen" alt="OpenSource Community Standards" />
  </a>

  <!-- Third Row -->

  <br />
  <a href="https://github.com/ful1e5">
    <img alt="Made By Kaiz"  src="https://kaiz.vercel.app/api/badge" width="133" />
  </a>
</p>

<!-- Intro -->

---

<p align="center">
    ⚡ Start writing <b>dev.to</b> articles with
    <a href="https://github.com/ful1e5/TheActionDev-template/generate">
      <b>TheActionDev-template</b>
    </a>
</p>

---

# What is TheActionDev?

TheActionDev is Github Action allow you to write & Maintining [dev.to](https://dev.to/) **articles** without touching `dev.to` UI. This action is initiate in **[#actionshackathon](https://dev.to/devteam/announcing-the-github-actions-hackathon-on-dev-3ljn)** and using **[DEV API]** under the hood. This action is scan your **Github Repository** based on `directory` [input](#inputs) and find articles based on **[Jekyll front matter](https://jekyllrb.com/docs/front-matter/)** in `markdown` files.

<!-- Usage -->

## Basic Usage

- You'll first need to create a YAML file to describe the workflow in your project (e.g. .github/workflows/TheActionDev.yaml).
- Generate dev.to `apiKey` by following [dev.to docs](https://docs.dev.to/api/#section/Authentication/api_key)
- Add your `apiKey` to **GitHub Secret** by following [Github Docs](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)

<!-- Usage Example -->

### TheActionDev.yaml

```yaml
name: TheActionDev Sync
on:
  push:
    branches:
      - main # your default branch

jobs:
  operations:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2

      - name: Sycing Article to dev.to
        uses: ful1e5/TheActionDev@v2
        with:
          api-key: ${{ secrets.DEVTO_API_KEY }} # Store your 'api-key' in Github Secret
          directory: ./articles # Your article directory
          ignore: Development.md, Production.md # Markdown file you wan't to ignore. Multple files separated by ,(comma)
```

<!-- Inputs of this Action -->

### Inputs

#### `api-key`

[DEV API] Key. Set inside **[Github Secret](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)**.

#### `directory`

Relative path to your articles files (\*.md) directory

#### `ignore`

The file you want to ignore by this action. This **feature** is implemented by [@actions/glob](https://github.com/actions/toolkit/tree/master/packages/glob),So you also provide **[glob pattern](https://github.com/actions/toolkit/tree/master/packages/glob#patterns)** with it.

<!-- Glob pattern example -->

for example, I want ignore all articles inside `foo` sub-directory, The action input look like this 👇.

```diff
.....

 - name: Sycing Article to dev.to
   uses: ful1e5/TheActionDev@v2
   with:
     api-key: ${{ secrets.DEVTO_API_KEY }}
     directory: ./articles
-     ignore: foo/bar.md, foo/hello.md
+     ignore: foo/**.md

.....

```

Listed files ignored **globally** by **TheActionDev**.

- README.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- CHANGELOG.md
- [Pull Request Templates](https://docs.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates#pull-request-templates)
- [Issue Templates](https://docs.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates#issue-templates)

## Writing Article with `TheActionDev`

### Front Matter

> **Original Docs @** [DEV Editor Guide 🤓](https://dev.to/p/editor_guide)

Custom variables set for each post, located between the triple-dashed lines in your editor. Here is a list of possibilities:

- **title:** the title of your article
- **published:** boolean that determines whether or not your article is published
- **description:** description area in Twitter cards and open graph cards
- **tags:** max of four tags, needs to be comma-separated
- **canonical_url:** link for the canonical version of the content
- **cover_image:** cover image for post, accepts a URL.(The best size is 1000 x 420.)
- **series:** post series name.

#### Front Matter `default` value

```
---
title: string                     # `Required`
published: true/false             # `Required` but 'false' by default
description: string               # `Optional`
tags: string                      # `Optional` multiple tags separated by ,(comma)
series: string                    # `Optional`
cover_image: string               # `Optional` url to image
canonical_url: string             # `Optional` url
---

# The Markdown Body here
```

### Article Body Basics

- Use [Markdown](https://guides.github.com/features/mastering-markdown/) to write and format posts.
- You can use [Liquid tags](https://docs.dev.to/frontend/liquid-tags/) to add rich content such as Tweets, YouTube videos, etc.

<!-- Article Example -->

### Example

```
---
title:  TheActionDev 👋
description: Hello World
published: false
tags: typescript, javascript, github
series: TheActionDev
---

First Post with **TheActionDev** 🤩

{% github ful1e5/TheActionDev %}
```

## Development

Check [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

# Branding

- Assets: [Figma](https://www.figma.com/file/mO5kSS79lY0NIMMzAJDBJZ/TheActionDev?node-id=0%3A1)
- Font: [JoyStick](www.pixelsagas.com/?download=joystick)

# Inspiration

- [DEV Docs 😍](https://docs.dev.to/)
- [vscode-devto 🔥](https://github.com/Sneezry/vscode-devto) extension for `vscode`
- [typescript-action 📦](https://github.com/actions/typescript-action)

<!-- Help -->

# Getting Help

You can create a **issue**, I will help you. 🙂

<!-- Contributions and Suggestion -->

# Contributing

Check [CONTRIBUTING.md](CONTRIBUTING.md), any suggestions for features and contributions to the continuing code masterelopment can be made via the issue tracker or code contributions via a `Fork` & `Pull requests`.

<!-- Support -->

## Support

Give a **★**, So other **OpenSource Ninja** don't miss this.

> For more support

<a href="https://www.buymeacoffee.com/Nt7Wg4V" target="_blank">
  <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" >
</a>

<!-- Ninja  -->

<h1 align="center">
  ♫♪.ılılıll|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|llılılı.♫♪
</h1>
<p align="center">
  <sub>Ninja is listing 
  <a href="https://en.wikipedia.org/wiki/Hardstyle">
    <b>HardStyle</b>
  </a>
  </sub>
</p>

<!-- Reuse Links -->

[dev api]: https://docs.dev.to/api/
