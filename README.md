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

  <!-- Second Row -->
  </br >
  <a href="https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html">
    <img alt="npm type definitions" src="https://img.shields.io/npm/types/typescript">
  </a>

  <a href="https://github.com/ful1e5/TheActionDev/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/ful1e5/TheActionDev?color=0081FB" />
  </a>

 <!-- Third Row -->
  <br />
  <a href="https://github.com/ful1e5">
    <img alt="Made By Kaiz"  src="https://kaiz.vercel.app/api/badge" width="133" />
  </a>
</p>

<!-- Intro -->

# What is TheActionDev

TheActionDev is Github Action allow you to write & Maintining [dev.to](https://dev.to/) **articles** without touching `dev.to` UI. This entire action developed in **[#ActionsHackathon](https://dev.to/devteam/announcing-the-github-actions-hackathon-on-dev-3ljn)** with **[dev.to OpenApi](https://docs.dev.to/api/)** & **Typescript**. This action is scan your **Github Repository** directories and find articles based on `yaml` **MetaData** inside `.md`(markdown file).

<!-- Usage -->

# Basic Usage

1. You'll first need to create a YAML file to describe the workflow in your project (e.g. .github/workflows/TheActionDev.yml).
2. Generate dev.to `apiKey` by following [this docs](https://docs.dev.to/api/#section/Authentication/api_key)
3. Add your `apiKey` to **GitHub Secret**

<!-- Article Structure -->

### Article Structure

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

# Body goes here...
```

### Article Body Basics

- Use [Markdown](https://guides.github.com/features/mastering-markdown/) to write and format posts.
- You can use [Liquid tags](https://docs.dev.to/frontend/liquid-tags/) to add rich content such as Tweets, YouTube videos, etc.

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
