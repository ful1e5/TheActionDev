import fs from "fs";
import path from "path";
import * as core from "@actions/core";

import { ArticleData } from "../api/DevApi";

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
  title(): string | undefined {
    const msg = `'title:' is Required in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return undefined;
    }
    const title = this._yaml[1].match(/^[ \t]*title:[ \t]*(.*?)[ \t]*$/m);
    if (!title) {
      core.warning(msg);
      return undefined;
    }

    return decodeURIComponent(title[1]);
  }

  /**
   * Get "cover_image" meta-data from markdown file
   */
  coverImage(): string | null {
    const msg = `Set 'cover_image:' as {null} default in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return null;
    }
    const coverImage = this._yaml[1].match(
      /^[ \t]*cover_image:[ \t]*(.*?)[ \t]*$/m
    );
    if (!coverImage) {
      core.warning(msg);
      return null;
    }

    return decodeURIComponent(coverImage[1]);
  }

  /**
   * Get "series" meta-data from markdown file
   */
  series(): string {
    const msg = `Set 'series:' as ""(empty) default in ${this._maskedURI}`;
    if (!this._yaml) {
      core.debug(msg);
      return "";
    }
    const series = this._yaml[1].match(/^[ \t]*series:[ \t]*(.*?)[ \t]*$/m);
    if (!series) {
      core.debug(msg);
      return "";
    }

    return decodeURIComponent(series[1]);
  }

  /**
   * Get "canonical_url" meta-data from markdown file
   */
  canonicalUrl(): string {
    const msg = `Set 'canonical_url:' as ""(empty) default in ${this._maskedURI}`;
    if (!this._yaml) {
      core.debug(msg);
      return "";
    }
    const canonicalUrl = this._yaml[1].match(
      /^[ \t]*canonical_url:[ \t]*(.*?)[ \t]*$/m
    );
    if (!canonicalUrl) {
      core.debug(msg);
      return "";
    }

    return decodeURIComponent(canonicalUrl[1]);
  }

  /**
   * Get "tags" meta-data from markdown file
   */
  tags(): string[] | [] {
    const msg = `Set 'tags:' as [] Default in ${this._maskedURI}`;
    if (!this._yaml) {
      core.debug(msg);
      return [];
    }

    const tags = this._yaml[1].match(/^[ \t]*tags:[ \t]*(.*?)[ \t]*$/m);
    if (!tags) {
      core.debug(msg);
      return [];
    }

    return tags[1]
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");
  }

  /**
   * Get "published" meta-data from markdown file
   */
  publishState(): boolean {
    const msg = `Set "published: false" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.info(msg);
      return false;
    }
    const published = this._yaml[1].match(
      /^[ \t]*published:[ \t]*(.*?)[ \t]*$/m
    );
    if (!published) {
      core.info(msg);
      return false;
    }

    return published[1] === "true";
  }

  /**
   * Get article "body" from markdown file
   */
  body(): string | undefined {
    const msg = `Can't Parse "Markdown Body" in ${this._maskedURI}`;
    if (!this._yaml) {
      core.warning(msg);
      return undefined;
    }
    const body = this._markdown
      .replace(this._yaml[1], "")
      .replace(/-{3}\n{2}/g, "");
    if (!body) {
      core.warning(msg);
      return undefined;
    }

    return body;
  }

  /**
   * Get Repo Article Data
   */
  data(): ArticleData {
    // Must require
    const title = this.title();
    const body_markdown = this.body();

    // Automatically handle
    const published = this.publishState();
    const tags = this.tags();
    const series = this.series();
    const coverImage = this.coverImage();
    const canonicalUrl = this.canonicalUrl();

    if (title && body_markdown) {
      return {
        title,
        published,
        series,
        tags,
        canonical_url: canonicalUrl,
        cover_image: coverImage,
        body_markdown
      };
    }

    throw new Error(`Can't Parse ${this._maskedURI}`);
  }
}
