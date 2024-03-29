import * as core from "@actions/core";

import { DevtoApi } from "./apis/devto";
import { LocalArticleApi } from "./apis/local";
import { getInputAsArray } from "./utils/getInputAsArray";

import { Article } from "./types";

const dumpArticleInfo = (article: Article): void => {
  core.info("");
  core.info(`title: ${article.title}`);
  core.info(`published: ${article.published}`);
  core.info(`tags: ${article.tags}`);
  core.info(`description: ${article.description}`);
  core.info(`cover image: ${article.main_image}`);
  core.info(`canonical Url: ${article.canonical_url}`);
  core.info(`series: ${article.series}`);
  core.info(`organization id: ${article.organization_id}`);
  core.info("");
};

const main = async (): Promise<void> => {
  // Prepare TheActionDev
  core.startGroup("Preparing TheActionDev");

  const key = core.getInput("api-key", { required: true });
  const directory = core.getInput("directory");
  const ignore = getInputAsArray("ignore");

  const devtoApi = new DevtoApi(key);
  const liveArticles = await devtoApi.getAllArticles();

  const localApi = new LocalArticleApi(ignore);

  core.endGroup();

  // Fetching local articles
  core.startGroup("Fetching local articles");
  const files = await localApi.files(directory);
  if (!files) {
    core.info("0 articles found.\n Nothing to do.");
    return;
  } else {
    core.info(`${files.length} articles found.`);
    core.endGroup();
  }

  // Synchronise Article with dev.to
  try {
    for (const file of files) {
      core.startGroup(`Synchronising ${file}`);

      core.debug(`Parsing ${file}`);
      const article = localApi.parse(file);

      if (article) {
        dumpArticleInfo(article);
        const update = liveArticles.filter(a => a.title === article.title);
        const articleStatus = article.published ? "published" : "draft";

        if (update[0]) {
          core.info(`Updating '${article.title}' as ${articleStatus}...`);
          if (!update[0].id) {
            throw new Error(`Unable to find 'id' of '${article.title}'`);
          }
          await devtoApi.updateArticle(update[0].id, article);
          core.info("Updated.");
        } else {
          core.info(`Creating '${article.title}' as ${articleStatus}...`);
          await devtoApi.createArticle(article);
          core.info("Created.");
        }
      } else {
        core.info(`Unable to parse: ${file}\nSkipping.`);
      }

      core.endGroup();
    }
  } catch (err) {
    console.error(err);
    core.setFailed("");
  }
};

main();
