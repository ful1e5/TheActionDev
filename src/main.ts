import * as core from "@actions/core";
import { DevAPI } from "./api/DevApi";
import { RepoArticlesProvider } from "./content/RepoArticlesProvider";

export const run = async (): Promise<void> => {
  try {
    const apiKey: string = core.getInput("apiKey", { required: true });
    const articlesPath: string = core.getInput("articlesPath");

    const api = new DevAPI(apiKey);
    const articles = await api.list();
    const authorProfileLink = await api.profileLink();

    const repo = new RepoArticlesProvider(articlesPath);
    repo.sync(articles, authorProfileLink);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
