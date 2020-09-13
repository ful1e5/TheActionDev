import * as glob from "@actions/glob";
import * as core from "@actions/core";
import * as github from "@actions/github";

import { MetaParser } from "./MetaParser";
import { DevAPI } from "../api/DevApi";

export class RepoArticlesProvider {
  name: string;
  apiLink: string;
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
    this.apiLink = `https://api.github.com/${github.context.repo.owner}/${this.name}`;
    // this.dispatchLink = `${this.httpsLink}/actions/workflows/${github.context.workflow}/dispatches`;
    this.dispatchLink = `${this.apiLink}/dispatches`;

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
   * @param api dev.to api instance
   */
  async sync(api: DevAPI): Promise<void> {
    core.startGroup(`Syncing ${this.name} articles with dev.to`);
    const data: MetaParser[] = [];

    const articles = await api.list();
    const authorProfileLink = await api.profileLink();

    if (!articles) {
      throw new Error("Articles not fetched from dev.to api");
    } else {
      core.info(
        `⚡ ${articles.length} articles fetched from ${authorProfileLink}`
      );
    }

    for (const file of await this.files()) {
      data.push(new MetaParser(file));
    }

    for (const repoArticle of data) {
      const isDraft = repoArticle.publishState() ? "as published" : "as draft";

      const [presentOnDev] = articles.filter(
        a => a.title === repoArticle.title()
      );

      if (presentOnDev?.id) {
        core.info(`📝 Updating "${repoArticle.title()}" ${isDraft}...`);
        try {
          const response = await api.update(
            presentOnDev.id,
            repoArticle.data()
          );
          console.log(response);
        } catch (error) {
          core.warning(error);
        }
      } else {
        core.info(`⬆️ Uploading "${repoArticle.title()}" ${isDraft}...`);
      }
    }

    core.endGroup();
  }
}
