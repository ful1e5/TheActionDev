import * as core from "@actions/core";
import fs from "fs";

export class MetaParser {
  private _markdown: string;
  private _yaml: RegExpMatchArray | null;

  constructor(private _fileURI: string) {
    this._markdown = fs.readFileSync(this._fileURI).toString();
    this._yaml = this._markdown.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);

    if (this._markdown === "") {
      core.warning(`${this._fileURI} is Empty`);
      return;
    }
    if (this._yaml === null) {
      core.warning(`yaml meta-data not found in ${this._fileURI}`);
      return;
    }
  }

  titleParser(): string | null {
    if (!this._yaml) {
      return null;
    }
    const title = this._yaml[1].match(/^[ \t]*title:[ \t]*(.*?)[ \t]*$/m);
    if (!title) {
      return null;
    }

    return decodeURIComponent(title[1]);
  }

  descriptionParser(): string | null {
    if (!this._yaml) {
      return null;
    }
    const description = this._yaml[1].match(
      /^[ \t]*description:[ \t]*(.*?)[ \t]*$/m
    );
    if (!description) {
      return null;
    }

    return decodeURIComponent(description[1]);
  }

  tagsParser(): string[] | null {
    if (!this._yaml) {
      return null;
    }

    const tags = this._yaml[1].match(/^[ \t]*tags:[ \t]*(.*?)[ \t]*$/m);
    if (!tags) {
      return null;
    }

    return tags[1]
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");
  }

  publishStateParser(): boolean | null {
    if (!this._yaml) {
      return false;
    }
    const published = this._yaml[1].match(
      /^[ \t]*published:[ \t]*(.*?)[ \t]*$/m
    );
    if (!published) {
      return false;
    }

    return published[1] === "true";
  }

  bodyParser(): string | null {
    if (!this._yaml) {
      return null;
    }
    const body = this._markdown.replace(this._yaml[1], "");
    if (!body) {
      return null;
    }

    return decodeURIComponent(body);
  }
}
