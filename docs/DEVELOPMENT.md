# Development

## Notes

- Sometime dev.to api may respond with `5xx`.
- If you're using your personal dev.to account for development
  set `published: false` or removed it from front-matter.
- Set `ACTIONS_RUNNER_DEBUG` **GitHub Environment Variable** to `TRUE` for extra logs.

## Tools & Workflow

### NPM Scripts

I'm using **yarn** as package manager. If you are using **npm**, You have to replace `yarn`
with `npm` or create new script:

```diff
...
  scripts: {
    "rebuild": "yarn clean && yarn build",
+   "rebuild:npm": "npm clean && npm build"
  }
...

```

### Test:

```bash
$ yarn test
```

### Run Action locally:

To run this action locally,You have to use **[act](https://github.com/nektos/act)**.
After Install **act** follow these steps.

#### Set dev.to `api-key` Secret

File: **.secret**

```
DEVTO_API_KEY=
```

#### Run

```bash
$ act
```

## Awesome Docs/Tools

- [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#introduction)
- [Action Metadata Syntax](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions)
- [@vercel/ncc](https://github.com/vercel/ncc)
- [typescript-action](https://github.com/actions/typescript-action)
