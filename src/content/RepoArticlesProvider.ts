import * as glob from "@actions/glob";
import * as core from "@actions/core";
import * as github from "@actions/github";

export class RepoArticlesProvider {
  private _repoName: string;
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
    // Set Repo Name
    this._repoName = github.context.repo.repo;

    // Ignoring user files
    const userIgnore = core.getInput("ignoreFiles");

    if (userIgnore !== "") {
      core.debug(`Ignoring ${userIgnore} to Sync`);

      const userIgnoreFiles = userIgnore
        .split(",")
        .map(f => `!**/${f.trim()}`)
        .filter(f => f !== "");
      core.debug(`User Ignore Files: ${userIgnoreFiles}`);

      this._excludePattern.push(...userIgnoreFiles);
    } else {
      core.debug("ignoreFiles input not set");
    }
  }

  private async files() {
    const pattern = [`${this._path}/*.md`, ...this._excludePattern];

    core.info(`Syncing ${this._repoName} articles with dev.to`);
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
