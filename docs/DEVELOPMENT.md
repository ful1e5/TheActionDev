# Development

## Development Tips

- Always set `published: false`(or **removed it**) In Article _Front Matter_ ,If you're using your **personal dev.to** account for developement.
- Sometime dev.to api may respond with `5xx`.(Take a cup of coffee ☕ or listen the **lo-fi** beats 🎶 until dev.to team fix it.)
- Set `ACTIONS_RUNNER_DEBUG` **GitHub Secret** to `TRUE` for extra logs 📃.

## Tools / Devflow

### Yarn

I'm using **yarn** as package manager. If you are using **npm**, You have to replace `yarn` with `npm` or create new script like this 👇. You also **PullRequest** this workaround in **[#Hacktoberfest](https://hacktoberfest.digitalocean.com/)** .

```diff
...
  scripts: {
    "rebuild": "yarn clean && yarn build",
+   "rebuild:npm": "npm clean && npm build"
  }
...

```

> 🚨 **Alert :** don't change `action` script, Because **Github Action** using _npm_.I also added `action:yarn` for _yarn_.

### Run Action locally:

To run this action locally,You have to use **[act](https://github.com/nektos/act)**.
After Install **act** follow these steps.

#### Set dev.to `api-key` to Env variable

```bash
$ export TOKEN=<key here>
```

> 😎 **Pro Tip**: you also add this `export` command in your `.zshrc` or `.bashrc`.

#### Install packages

```bash
$ yarn install
```

#### Run

```bash
$ yarn dev
```

#### Run with Github Action

**Push** or **Pull Request** code to `main` branch. Code changes on **\*.md** is not trigger **[build-test](https://github.com/ful1e5/TheActionDev/actions?query=workflow%3Abuild-test)** CI

### Prepare Package for Release

#### Development Packaging

```bash
$ yarn pack:dev
```

#### Production Packaging

```bash
$ yarn package
```

### Testing(with Jest)

<!-- TODO:Remove this after test -->

> Tests isn't written yet 😔

```bash
$ yarn test
```

# Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed `dist` directory.

Then run [ncc](https://github.com/zeit/ncc) and **push** the results:

```bash
$ yarn package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

> **Note :** I recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! 🚀

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

# Awesome Docs/Tools

- [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#introduction)
- [Action Metadata Syntax](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)
- [@vercel/ncc](https://github.com/vercel/ncc)
- [typescript-action](https://github.com/actions/typescript-action)

## License - `MIT`
