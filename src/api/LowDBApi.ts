import low from "lowdb";
import * as core from "@actions/core";

import FileSync from "lowdb/adapters/FileSync";
import { Article } from "./DevApi";

export class LowDBApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _db: low.LowdbSync<any>;

  constructor(private _dbPath: string) {
    const adapter = new FileSync(this._dbPath);
    this._db = low(adapter);

    // Writing default data-structure
    this._db.defaults({ articles: {} }).write();
    core.debug(`Sync DB init at ${this._dbPath}`);
  }

  /**
   *
   * @param article article to save in Database
   * create & overwrite article in DB
   */
  saveArticle(article: Article) {
    const id = article.id;
    delete article.id;

    this._db.set(`articles[${id}]`, article).write();
    core.debug(`Article ${article.title} saved in db`);
  }

  /**
   * Fetch all `articles` in Database
   */
  articles(): Article[] {
    const articles: Article[] = [];

    const value = this._db.get("articles").value();

    for (const [id] of Object.entries(value)) {
      articles.push({ id, ...value[id] });
    }

    return articles;
  }
}
