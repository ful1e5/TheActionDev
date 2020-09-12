import * as glob from "@actions/glob";
import * as core from "@actions/core";
import * as github from "@actions/github";

import { MetaParser } from "./MetaParser";
import { Article } from "../api/DevApi";
import { LowDBApi } from "../api/LowDBApi";

export class RepoArticlesProvider {
  name: string;
  httpsLink: string;
  dispatchLink: string;
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
    this.name = github.context.repo.repo;
    this.httpsLink = `https://www.github.com/${github.context.repo.owner}/${this.name}`;
    this.dispatchLink = `${this.httpsLink}/actions/workflows/${github.context.workflow}/dispatches`;

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
   * @param articles Live Articles from dev.to
   * @param authorLink dev.to/user_name
   * @param db LowDBApi instance
   */
  async sync(resource: {
    articles: Article[];
    authorProfileLink: string | null;
    db: LowDBApi;
  }): Promise<void> {
    core.startGroup(`Syncing ${this.name} articles with dev.to`);
    const data: MetaParser[] = [];

    core.info(
      `⚡ ${resource.articles.length} articles fetched from ${resource.authorProfileLink}`
    );

    for (const file of await this.files()) {
      data.push(new MetaParser(file));
    }

    for (const article of data) {
      const isDraft = article.publishStateParser()
        ? "as published"
        : "as draft";
      core.info(`⬆️ Uploading ${article.titleParser()} ${isDraft}...`);
    }

    core.endGroup();
  }
}
