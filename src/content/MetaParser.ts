import fs from "fs";
import path from "path";
import * as core from "@actions/core";

import { Article } from "../api/DevApi";

export class MetaParser {
  private _markdown: string;
  private _yaml: RegExpMatchArray | null;
  private _maskedURI: string;

  constructor(private _fileURI: string) {
    this._markdown = fs.readFileSync(this._fileURI).toString();
    this._yaml = this._markdown.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);

    this._maskedURI = `${core.getInput("directory")}/${path.basename(
      this._fileURI
    )}`;

    if (this._markdown === "") {
      core.info(`${this._maskedURI} is Empty`);
      return;
    }
    if (this._yaml === null) {
      core.info(`yaml meta-data not found in ${this._maskedURI}`);
      return;
    }
  }

  /**
   * Get "title" meta-data from markdown file
   */
  titleParser(): string | null {
    const msg = `Can't Parse "title" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return null;
    }
    const title = this._yaml[1].match(/^[ \t]*title:[ \t]*(.*?)[ \t]*$/m);
    if (!title) {
      core.warning(msg);
      return null;
    }

    return decodeURIComponent(title[1]);
  }

  /**
   * Get "description" meta-data from markdown file
   */
  descriptionParser(): string | null {
    const msg = `Can't Parse "description" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return null;
    }
    const description = this._yaml[1].match(
      /^[ \t]*description:[ \t]*(.*?)[ \t]*$/m
    );
    if (!description) {
      core.warning(msg);
      return null;
    }

    return decodeURIComponent(description[1]);
  }

  /**
   * Get "tags" meta-data from markdown file
   */
  tagsParser(): string[] | null {
    const msg = `Can't Parse "tags" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return null;
    }

    const tags = this._yaml[1].match(/^[ \t]*tags:[ \t]*(.*?)[ \t]*$/m);
    if (!tags) {
      core.warning(msg);
      return null;
    }

    return tags[1]
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");
  }

  /**
   * Get "published" meta-data from markdown file
   */
  publishStateParser(): boolean | null {
    const msg = `Can't Parse "published" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return false;
    }
    const published = this._yaml[1].match(
      /^[ \t]*published:[ \t]*(.*?)[ \t]*$/m
    );
    if (!published) {
      core.warning(msg);
      return false;
    }

    return published[1] === "true";
  }

  /**
   * Get article "body" from markdown file
   */
  bodyParser(): string | null {
    const msg = `Can't Parse "Markdown Body" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return null;
    }
    const body = this._markdown.replace(this._yaml[1], "");
    if (!body) {
      core.warning(msg);
      return null;
    }

    return decodeURIComponent(body);
  }

  /**
   * Get Article
   */
  article(): Article {
    const title = this.titleParser();
    const description = this.descriptionParser();
    const published = this.publishStateParser();
    const body_markdown = this.bodyParser();

    if (title && published && body_markdown && description) {
      return {
        title,
        published,
        description,
        body_markdown
      };
    }

    throw new Error(`Can't Parse ${this._maskedURI}`);
  }
}
