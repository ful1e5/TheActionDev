import * as core from "@actions/core";
import fs from "fs";

export class MetaParser {
  private _markdown: string;

  constructor(private _fileURI: string) {
    this._markdown = fs.readFileSync(this._fileURI).toString();

    if (this._markdown === "") {
      core.warning(`${this._fileURI} is Empty`);
      return;
    }
  }

  titleParser(): string | null {
    const yaml = this._markdown.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);
    if (!yaml) {
      return null;
    }
    const title = yaml[1].match(/^[ \t]*title:[ \t]*(.*?)[ \t]*$/m);
    if (!title) {
      return null;
    }

    return decodeURIComponent(title[1]);
  }

  descriptionParser(): string | null {
    const yaml = this._markdown.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);
    if (!yaml) {
      return null;
    }
    const description = yaml[1].match(/^[ \t]*description:[ \t]*(.*?)[ \t]*$/m);
    if (!description) {
      return null;
    }

    return decodeURIComponent(description[1]);
  }

  tagsParser(): string[] | null {
    const yaml = this._markdown.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);
    if (!yaml) {
      return null;
    }

    const tags = yaml[1].match(/^[ \t]*tags:[ \t]*(.*?)[ \t]*$/m);
    if (!tags) {
      return null;
    }

    return tags[1]
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");
  }

  publishStateParser() {
    const yaml = this._markdown.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);
    if (!yaml) {
      return false;
    }
    const published = yaml[1].match(/^[ \t]*published:[ \t]*(.*?)[ \t]*$/m);
    if (!published) {
      return false;
    }

    return published[1] === "true";
  }

  bodyParser() {
    // TODO:
  }
}
