import * as core from "@actions/core";

import { DevAPI } from "./api/DevApi";
import { RepoArticlesProvider } from "./content/RepoArticlesProvider";

// TODO: Run action on webhooks and send update articles with pull request

/**
 * Run TheActionDev
 */
export const run = async (): Promise<void> => {
  try {
    const apiKey: string = core.getInput("api-key", { required: true });
    const articlesPath: string = core.getInput("directory");

    const api = new DevAPI(apiKey);
    const repo = new RepoArticlesProvider(articlesPath);

    // await api.createWebhook(repo.name, repo.dispatchLink);
    await api.webhooks();

    const articles = await api.list();
    const authorProfileLink = await api.profileLink();

    repo.upload({ articles, authorProfileLink });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
