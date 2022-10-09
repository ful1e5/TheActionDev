# TheActionDev

Write dev.to articles with **GitHub Action**.

<!-- Badges -->

[![ci](https://github.com/ful1e5/TheActionDev/actions/workflows/ci.yml/badge.svg)](https://github.com/ful1e5/TheActionDev/actions/workflows/ci.yml)
[![Releases](https://img.shields.io/github/v/release/ful1e5/TheActionDev)](https://github.com/ful1e5/TheActionDev/releases)
[![Coverage](https://codecov.io/gh/ful1e5/TheActionDev/branch/main/graph/badge.svg?token=3M1OY1SMO3)](https://codecov.io/gh/ful1e5/TheActionDev)

Start writing **dev.to** articles with [TheActionDev-template](https://github.com/ful1e5/TheActionDev-template)

## Notice

### :warning: Deprecation of v1 and v2

**As of May 28, 2022, v1 and v2 has been fully sunset and no longer functions**

Due to the deprecation of the underlying utility functions, the TheActionDev GitHub Action
has released `v3` which will use the [js-yaml] library for parsing front-matter in articles.

I will be restricting any updates to the `v1` and `v2` Actions to security updates and hotfixes.

#### Migration from `v1` and `v2` to `v3`

The `v3` uploader has a few breaking changes for users

- Multiple tags have not been assigned as string with colon(,) or have been deprecated. Instead of use
  [YAML Array List] to assign it.

## What is TheActionDev?

**TheActionDev** is Github Action that allows you to write & upsert dev.to **articles**
without touching the `dev.to` UI. This action is initiated in **[ActionsHackathon]** and using **[forem API]**.
This action is scan your **Github Repository** based on `directory` [input](#inputs) and finds articles based
on the **[Jekyll front matter]** in `markdown` files.

## Basic Usage

- You'll first need to create a YAML file to describe the workflow in your project
  (e.g. .github/workflows/TheActionDev.yml).
- Generate dev.to `apiKey` by following
  [Forem API Docs](https://developers.forem.com/api/#section/Authentication/api_key)
- Add your `apiKey` to **GitHub Secret** by following
  [GitHub Docs](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets)

### TheActionDev.yml

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
        uses: ful1e5/TheActionDev@v3
        with:
          api-key: ${{ secrets.DEVTO_API_KEY }} # Store your 'api-key' in Github Secret
          directory: ./articles # Your article directory
          ignore: Development.md, Production.md # Markdown file you wan't to ignore. Multple files separated by ,(comma)
```

### Inputs

#### `api-key`

dev.to api key.

#### `directory`

Relative path to your articles(`*.md`) directory.

#### `ignore`

The file you want to ignore by this action. This **feature** is implemented by [@actions/glob],
So you also provide **[glob pattern]** with it. **Following files are ignored by default :**

- README.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- CHANGELOG.md
- [Pull Request Templates](https://docs.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates#pull-request-templates)
- [Issue Templates](https://docs.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates#issue-templates)

For example, you want ignore all articles inside `foo` sub-directory, The `ignore` input look like this:

```diff
.....

 - name: Sycing Article to dev.to
   uses: ful1e5/TheActionDev@v3
   with:
     api-key: ${{ secrets.DEVTO_API_KEY }}
     directory: ./articles
-     ignore: foo/bar.md, foo/hello.md
+     ignore: foo/**.md

.....

```

## Writing Article with `TheActionDev`

### Front Matter

> Original Docs at [DEV editor guide](https://dev.to/p/editor_guide)

Custom variables set for each post, located between the triple-dashed lines in your editor. Here is a list of possibilities:

- **title:** the title of your article
- **published:** boolean or date that determines whether your article is published. The next case exist:
  - Boolean is `true` the article will be `published`.
  - Boolean is `false` the article will be `not published`.
  - Date is in the `past` the article will be `published`.
  - Date is in the `future` the article will be `not published`.
- **description:** description area in Twitter cards and open graph cards
- **tags:** max of four tags, needs to be [YAML Array List]
- **canonical_url:** link for the canonical version of the content
- **cover_image:** cover image for post, accepts a URL.(The best size is 1000 x 420.)
- **series:** post series name.

#### Front Matter `default` value

| tag           | value   | required |
| :------------ | :------ | :------- |
| title         | `null`  | **yes**  |
| published     | `false` | **no**   |
| description   | `null`  | **no**   |
| tags          | `[]`    | **no**   |
| canonical_url | `null`  | **no**   |
| cover_image   | `null`  | **no**   |
| series        | `null`  | **no**   |

### Article Basics

- Use [YAML](https://yaml.org/) to write and format article's [front-matter](#front-matter).
- Follow [dev.to editor guide](https://dev.to/p/editor_guide) for write and format article body.
- You can also use [Liquid tags](https://docs.dev.to/frontend/liquid-tags/) to add rich content such as Tweets,
  YouTube videos, etc.

### Examples

#### Basic Article

```
---
title:  TheActionDev
description: Hello World
published: false
tags:
  - typescript
  - javascript
  - github
series: TheActionDev
---

First Post with **TheActionDev**

{% github ful1e5/TheActionDev %}
```

#### Scheduled Article

```
---
title:  TheActionDev
description: Hello World
published: 2023-01-01T22:00:00+02:00
tags:
  - typescript
  - javascript
  - github
series: TheActionDev
---

First Post with **TheActionDev**

{% github ful1e5/TheActionDev %}
```

## Development

Check [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)

## Branding

- Assets: [Figma](https://www.figma.com/file/mO5kSS79lY0NIMMzAJDBJZ/TheActionDev?node-id=0%3A1)
- Font: [JoyStick](www.pixelsagas.com/?download=joystick)

## Inspiration

- [DEV Docs](https://docs.dev.to/)
- [vscode-devto](https://github.com/Sneezry/vscode-devto) extension for `vscode`
- [typescript-action](https://github.com/actions/typescript-action)

## Contributing

Check [CONTRIBUTING.md](CONTRIBUTING.md), any suggestions for features and contributions to the continuing code
masterelopment can be made via the issue tracker or code contributions via a `Fork` & `Pull requests`.

<!-- Links  -->

[forem api]: https://developers.forem.com/api/
[theactiondev-template]: https://github.com/ful1e5/TheActionDev-template/generate
[actionshackathon]: https://dev.to/devteam/announcing-the-github-actions-hackathon-on-dev-3ljn
[js-yaml]: https://www.npmjs.com/package/js-yaml
[@actions/glob]: https://github.com/actions/toolkit/tree/master/packages/glob
[glob pattern]: https://github.com/actions/toolkit/tree/master/packages/glob#patterns
[yaml array list]: https://www.w3schools.io/file/yaml-arrays/
[jekyll front matter]: https://jekyllrb.com/docs/front-matter/
