import * as glob from "@actions/glob";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { MetaParser } from "./MetaParser";
import { Article } from "../api/DevApi";

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
   * @param _path Path to local Articles
   */
  constructor(private _path?: string) {
    // Set Repo Name
    this._repoName = github.context.repo.repo;

    // Ignoring user files
    const userIgnore = core.getInput("ignore");

    if (userIgnore !== "") {
      core.info(`Ignoring ${userIgnore} to Sync`);

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

  /**
   * Get all local dev.to articles absolute paths
   */
  private async files(): Promise<string[]> {
    const pattern = [`${this._path}/*.md`, ...this._excludePattern];

    const globber = await glob.create(pattern.join("\n"), {
      followSymbolicLinks: false
    });

    return await globber.glob();
  }

  /**
   *
   * @param articles Live Articles from dev.to
   * @param authorLink dev.to/<username>
   */
  async sync(
    articles: Article[],
    authorProfileLink: string | null
  ): Promise<void> {
    core.startGroup(`Syncing ${this._repoName} articles with dev.to`);
    const data: MetaParser[] = [];

    core.info(
      `⚡ ${articles.length} articels fetched from ${authorProfileLink}`
    );

    for (const file of await this.files()) {
      data.push(new MetaParser(file));
    }

    for (const article of data) {
      const isDraft = article.publishStateParser() ? "" : "as draft";
      core.info(`⬆️ Uploading ${article.titleParser()} ${isDraft}...`);
    }

    core.endGroup();
  }
}
