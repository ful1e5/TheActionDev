import * as core from "@actions/core";
import got, { Method, Options, RequestError, Response } from "got";

import { Article, DevtoError } from "../types";

export class DevtoApi {
  constructor(private _apiKey: string) {}

  private _buildRequestOptions({
    method,
    param,
    authRequest,
    article
  }: {
    method: Method;
    param?: { [key: string]: string | number };
    article?: Article | { body_markdown: string };
    authRequest?: Boolean;
  }): Options {
    const options: Options = {
      prefixUrl: "https://dev.to/api",
      method: method,
      searchParams: param,
      responseType: "json",
      hooks: {
        beforeError: [
          error => {
            this._handleError(error);
            return error;
          }
        ]
      }
    };

    // Passing dev.to Authorization header manually
    if (authRequest) {
      options.headers = {
        "api-key": this._apiKey
      };
    }

    // Body of request
    if (article) {
      options.json = { article: article };
    }

    return options;
  }

  private _handleError(reqError: RequestError) {
    const { response }: any = reqError;
    const error: DevtoError = response.body;
    core.error(`${error.status}: ${error.error}`);
  }
  private async _list(page: number): Promise<Article[]> {
    const options = this._buildRequestOptions({
      method: "GET",
      param: { page },
      authRequest: true
    });
    const res = (await got("articles/me/all", options)) as Response;
    const articles = res.body as Article[];

    return articles;
  }

  public async getAllArticles(): Promise<Article[]> {
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

  public async createArticle(article: Article): Promise<Response> {
    const options = this._buildRequestOptions({
      method: "POST",
      article,
      authRequest: true
    });
    const res = (await got("articles", options)) as Response;

    return res;
  }

  public async updateArticle(article: Article): Promise<Response> {
    const options = this._buildRequestOptions({
      method: "PUT",
      article,
      authRequest: true
    });
    const res = (await got("articles/" + article.id, options)) as Response;

    return res;
  }
}
