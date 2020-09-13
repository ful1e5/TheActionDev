import rq from "request-promise";
import * as core from "@actions/core";

export interface Article {
  id?: number;
  title: string;
  body_markdown?: string;
  published?: boolean;
  url?: string;
  published_at?: string;
  comments_count?: number;
  series?: string;
  tags?: string[];
  description?: string;
  cover_image: string | null;
  canonical_url?: string;
  positive_reactions_count?: number;
}

export interface ArticleData {
  title: string;
  published: boolean;
  cover_image: string | null;
  body_markdown: string;
  tags: string[];
  description: string;
  canonical_url: string;
  series: string;
}

export interface WebhookInput {
  webhook_endpoint: {
    target_url: string;
    source: string;
    events: string[];
  };
}

export interface User {
  id: number;
  username: string;
  name: string;
}

export interface WebHook {
  type_of: "webhook_endpoint";
  id: number;
  source: string;
  target_url: string;
  events: string[];
  created_at: string;
  user?: User;
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
    body?: WebhookInput | ArticleData
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

    if (body) {
      options.body = body;
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

    core.debug("DevApi: Listing all Articles");
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
    if (!user?.username) return null;

    const link = `https://dev.to/${user.username}`;
    core.debug(`DevApI: User Profile link generated ${link}`);
    return link;
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

    core.debug(`DevApi: Fetching Article by ${id} ID`);
    const response: Article = await rq(options);
    return response;
  }

  /**
   * Fetch all Webhooks
   */
  async webhooks(): Promise<WebHook[]> {
    const options = this._buildRequestOptions("/webhooks", "GET");

    core.debug("DevApi: Listing dev.to Webhooks");
    const response: WebHook[] = await rq(options);
    return response;
  }

  async getWebhookID(source: string): Promise<number | undefined> {
    const hooks = await this.webhooks();
    const hook = hooks.find(value => value.source === source);

    return hook?.id;
  }

  /**
   *
   * @param target_url Where dev send event
   * Create new Webhook
   */
  async createWebhook(source: string, target_url: string): Promise<WebHook> {
    const options = this._buildRequestOptions("/webhooks", "POST", undefined, {
      webhook_endpoint: {
        target_url,
        source,
        events: ["article_created", "article_updated"]
      }
    });

    core.debug("DevApi: Creating TheActionDev Webhooks");
    const response: WebHook = await rq(options);
    return response;
  }

  /**
   *
   * @param webHookID id of dev.to webhook
   * Delete Webhook
   */
  async deleteWebhook(webHookID: number) {
    const options = this._buildRequestOptions(
      `/webhooks/${webHookID}`,
      "DELETE"
    );

    core.debug("DevApi: Deleting 'TheActionDev' Webhook");
    await rq(options);
  }

  /**
   *
   * @param id unique identifier of dev.to post
   * @param articleData New Article Data
   * Upadte Post on dev.to by `id`
   */
  async update(id: number, articleData: ArticleData): Promise<Article> {
    const options = this._buildRequestOptions(
      `/articles/${id}`,
      "PUT",
      undefined,
      { ...articleData }
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
  async create(articleData: ArticleData): Promise<Article> {
    const options = this._buildRequestOptions("/articles", "POST", undefined, {
      ...articleData
    });
    core.debug("DevApi: Creating Article");
    const response: Article = await rq(options);
    return response;
  }
}
