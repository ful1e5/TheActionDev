import path from "path";
import * as core from "@actions/core";
import fs from "fs";

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
}
