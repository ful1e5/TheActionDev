import * as core from "@actions/core";

import { DevApi } from "./api/dev";

export const main = async (): Promise<void> => {
  const apiKey: string = core.getInput("api-key", { required: true });

  const api = new DevApi(apiKey);
  await api.getArticles();
};

main();
