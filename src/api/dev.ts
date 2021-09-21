import got, { Method, Options } from "got";

export class DevApi {
  constructor(private _apiKey: string) {}

  private _buildOptions({
    method,
    param
  }: {
    method: Method;
    param?: { [key: string]: string | number };
  }): Options {
    return {
      prefixUrl: "https://dev.to/api",
      method: method,
      headers: {
        "api-key": this._apiKey
      },
      searchParams: param,
      responseType: "json"
    };
  }

  /**
   * getArticles
   */
  public async getArticles() {
    const options = this._buildOptions({ method: "GET" });
    const res = await got("articles/me/all", options);
    console.log(res);
  }
}
