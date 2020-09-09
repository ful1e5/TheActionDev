import * as core from "@actions/core";
import { DevAPI } from "./api/DevApi";
import { RepoArticlesProvider } from "./content/RepoArticlesProvider";

export const run = async (): Promise<void> => {
  try {
    const apiKey: string = core.getInput("apiKey", { required: true });
    const articlesDir: string = core.getInput("articles-directory");

    const api = new DevAPI(apiKey);
    const repo = new RepoArticlesProvider(articlesDir);

    repo.syncArticles();
    const lists = await api.list();
    console.log(lists);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
