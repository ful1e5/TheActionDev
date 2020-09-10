import * as glob from "@actions/glob";
import * as core from "@actions/core";

export class RepoArticlesProvider {
  private _excludePattern: string[] = [
    "!**/README.md",
    "!**/CONTRIBUTING.md",
    "!**/CODE_OF_CONDUCT.md",
    "!**/CHANGELOGS.md"
  ];

  /**
   *
   * @param _path Path to local "dev.to" articels
   */
  constructor(private _path?: string) {
    const userIgnore = core.getInput("ignoreFiles");

    if (userIgnore !== "") {
      core.debug(`Ignoring ${userIgnore} to Sync`);

      const userIgnoreFiles = userIgnore.split(",").map(f => `!**/${f.trim()}`);
      core.debug(`User Ignore Files: ${userIgnoreFiles}`);

      this._excludePattern.push(...userIgnoreFiles);
    }
  }

  private async files() {
    const pattern = [`${this._path}/*.md`, ...this._excludePattern];

    core.info(`Looking articles inside ${this._path}`);
    const globber = await glob.create(pattern.join("\n"), {
      followSymbolicLinks: false
    });

    return await globber.glob();
  }

  async sync() {
    // TODO: Sync with Cron job
    console.log("Local Files", await this.files());
  }
}
