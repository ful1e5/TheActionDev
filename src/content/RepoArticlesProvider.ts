import * as glob from "@actions/glob";
import * as core from "@actions/core";

export class RepoArticlesProvider {
  private _excludePattern: string[] = [
    "!**/README.md",
    "!**/CONTRIBUTING.md",
    "!**/CODE_OF_CONDUCT.md",
    "!**/CHANGELOGS.md"
  ];

  constructor(private _path?: string) {
    this._excludePattern.push(
      ...core
        .getInput("ignoreFiles")
        .split(",")
        .map(f => `!${this._path}/${f}`)
    );
  }

  private async files() {
    const pattern = [`${this._path}/*.md`, this._excludePattern];
    const globber = await glob.create(pattern.join("\n"), {
      followSymbolicLinks: false
    });
    return await globber.glob();
  }

  async sync() {
    // TODO: Sync with Cron job
    console.log(await this.files());
    console.log("snycing..");
  }
}
