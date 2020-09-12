import path from "path";
import * as core from "@actions/core";

import { LowDBApi } from "./api/LowDBApi";
import { DevAPI } from "./api/DevApi";
import { RepoArticlesProvider } from "./content/RepoArticlesProvider";

// TODO: Run action on webhooks

/**
 * Run TheActionDev
 */
export const run = async (): Promise<void> => {
  try {
    const apiKey: string = core.getInput("api-key", { required: true });
    const articlesPath: string = core.getInput("directory");
    const dbPath = path.resolve(process.cwd(), "sync.json");

    const db = new LowDBApi(dbPath);
    const api = new DevAPI(apiKey);
    const repo = new RepoArticlesProvider(articlesPath);

    const articles = await api.list();
    const authorProfileLink = await api.profileLink();

    repo.sync({ articles, authorProfileLink, db });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
