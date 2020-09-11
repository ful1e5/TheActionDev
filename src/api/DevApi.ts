import rq from "request-promise";

export interface Article {
  id?: number;
  title: string;
  body_markdown?: string;
  published?: boolean;
  url?: string;
  published_at?: string;
  comments_count?: number;
  description?: string;
  positive_reactions_count?: number;
  reserveTitle?: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
}

export class DevAPI {
  constructor(private _apiKey?: string) {}

  /**
   *
   * @param path request path
   * @param method GET | POST
   * @param parameters Optional parameters to send parameters
   * @param article Optional parameters based on Article Interface
   */
  private _buildRequestOptions(
    path: string,
    method: string,
    parameters?: { [key: string]: string | number },
    article?: Article
  ): rq.OptionsWithUri {
    let uri = `https://dev.to/api${path}`;
    if (parameters) {
      const query: string[] = [];
      for (const parameterKey of Object.keys(parameters)) {
        query.push(`${parameterKey}=${parameters[parameterKey]}`);
      }
      uri += `?${query.join("&")}`;
    }
    const options: rq.Options = {
      uri,
      headers: {
        "api-key": this._apiKey
      },
      method,
      json: true
    };

    if (article) {
      options.body = article;
    }

    return options;
  }

  /**
   *
   * @param page `page` request parameter to dev.to
   */
  private async _list(page: number): Promise<Article[]> {
    const options = this._buildRequestOptions("/articles/me/all", "GET", {
      page
    });
    const response: Article[] = await rq(options);
    return response;
  }

  get hasApiKey(): boolean {
    return !!this._apiKey;
  }

  /**
   * Fetch authenticated User
   */
  private async _me(): Promise<User> {
    const options = this._buildRequestOptions("/users/me", "GET");
    const response: User = await rq(options);
    return response;
  }

  /**
   * Author profile url
   */
  async profileLink(): Promise<string | null> {
    const user = await this._me();
    if (user?.username) return null;

    return `https://dev.to/${user.username}`;
  }

  updateApiKey(apiKey: string) {
    this._apiKey = apiKey;
  }

  /**
   * Get all Articles from authenticated user
   */
  async list(): Promise<Article[]> {
    const articleList: Article[] = [];
    let page = 1;
    let responseList: Article[];
    do {
      responseList = await this._list(page);
      for (const response of responseList) {
        articleList.push(response);
      }
      page++;
    } while (responseList.length > 0);

    return articleList;
  }

  async get(id: number): Promise<Article> {
    const options = this._buildRequestOptions(`/articles/${id}`, "GET");
    const response: Article = await rq(options);
    return response;
  }

  /**
   *
   * @param id unique identifier of dev.to post
   * @param title Updated title
   * @param bodyMarkdown Post body(markdown)
   * Upadte Post on dev.to by `id`
   */
  async update(
    id: number,
    title: string,
    bodyMarkdown: string
  ): Promise<Article> {
    const options = this._buildRequestOptions(
      `/articles/${id}`,
      "PUT",
      undefined,
      { title, body_markdown: bodyMarkdown }
    );
    const response: Article = await rq(options);
    return response;
  }

  /**
   *
   * @param title New Post title
   * @param bodyMarkdown body of post(markdown)
   * Create new post on your dev.to profile
   */
  async create(title: string, bodyMarkdown: string): Promise<Article> {
    const options = this._buildRequestOptions("/articles", "POST", undefined, {
      title,
      body_markdown: bodyMarkdown
    });
    const response: Article = await rq(options);
    return response;
  }
}
