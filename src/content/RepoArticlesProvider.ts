import * as glob from "@actions/glob";
import * as core from "@actions/core";
import * as github from "@actions/github";

import { MetaParser } from "./MetaParser";
import { DevAPI } from "../api/DevApi";

export class RepoArticlesProvider {
  name: string;
  apiLink: string;
  dispatchLink: string;

  // Ignoring GitHub Markdowns
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
        .filter(f => f !== "")
        .map(f => `!**/${f.trim()}`);
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

    return globber.glob();
  }

  /**
   * @param api dev.to api instance
   */
  async sync(api: DevAPI): Promise<void> {
    const devProfileLink = await api.profileLink();
    core.startGroup(`Syncing ${this.name} articles with ${devProfileLink}`);

    const data: MetaParser[] = [];
    const articles = await api.list();

    if (!articles) {
      throw new Error("Articles not fetched from dev.to api");
    } else {
      core.info(
        `⚡ ${articles.length} articles fetched from ${devProfileLink}`
      );
    }

    // Creating MetaParser objects
    for (const file of await this.files()) {
      const obj = new MetaParser(file);

      // Printing Repo Article Info
      core.info(`\n\n ℹ️ ${obj.title()} Repo Article Available`);
      core.info(`Tags: ${obj.tags().toString()}`);
      core.info(`Description: ${obj.description()}`);
      core.info(`Canonical Url: ${obj.canonicalUrl()}`);
      core.info(`Series: ${obj.series()}`);
      core.info(`Published: ${obj.publishState()}`);
      data.push(obj);
    }

    // Loop through all repo articles
    for (const repoArticle of data) {
      const status = repoArticle.publishState() ? "published" : "draft";

      const [presentOnDev] = articles.filter(
        a => a.title === repoArticle.title()
      );

      if (presentOnDev?.id) {
        core.info(`📝 Updating "${repoArticle.title()}" as ${status}...`);
        try {
          const response = await api.update(
            presentOnDev.id,
            repoArticle.data()
          );
          core.info(
            `🔗 "${response.title}" available as "${status}" at ${response.url}`
          );
        } catch (error) {
          core.warning(error);
        }
      } else {
        core.info(`⬆️ Uploading "${repoArticle.title()}" as ${status}...`);
        try {
          const response = await api.create(repoArticle.data());
          core.info(
            `🔗 "${response.title}" available as "${status}" at ${response.url}`
          );
        } catch (error) {
          core.warning(error);
        }
      }
    }

    core.endGroup();
  }
}
