import fs from "fs";

export class RepoArticlesProvider {
  constructor(private _path: string) {}

  private _list() {
    return fs.readdirSync(this._path);
  }

  syncArticles() {
    console.log("snying..");
  }
}
