import * as core from "@actions/core";
import { DevAPI } from "./api/DevApi";
import { RepoArticlesProvider } from "./content/RepoArticlesProvider";

export const run = async (): Promise<void> => {
  try {
    const apiKey: string = core.getInput("apiKey", { required: true });
    const articelsPath: string = core.getInput("articelsPath");

    const api = new DevAPI(apiKey);
    const devToArticles = await api.list();

    const repo = new RepoArticlesProvider(articelsPath);
    repo.sync(devToArticles);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
