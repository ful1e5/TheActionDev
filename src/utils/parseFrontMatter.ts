import * as core from "@actions/core";
import { parseAsArray } from "./parseAsArray";

import { Article } from "../types";

const createPattern = (name: string) => {
  return new RegExp(`[ \t]*${name}:[ \t]*(.*?)[ \t]*$`, "m");
};

const parseFrontMatter = (data: string): Article | undefined => {
  core.info("Parsing Front-Matter...");
  const yml = data.match(/^\s*\-{3}\n([\s\S]*?)\n\-{3}/);

  if (yml != null) {
    const frontMatter = yml[1];

    //
    // We are checking title's null value here.
    // Other values are checked by Request handler (got).
    //

    core.debug("Parsing article title...");
    const title_str = frontMatter.match(createPattern("title"));
    let title: string;
    if (!title_str || title_str[1] == "") {
      core.error("Unable to find article title...");
      return;
    } else {
      title = title_str[1];
    }

    core.debug("Parsing article published state...");
    const published_str = frontMatter.match(createPattern("published"));
    let published: Boolean = !published_str
      ? false
      : published_str[1] === "true";

    core.debug("Parsing article description...");
    const description_str = frontMatter.match(createPattern("description"));
    const description = !description_str ? undefined : description_str[1];

    core.debug("Parsing article cover image...");
    const cover_image_str = frontMatter.match(createPattern("cover_image"));
    const cover_image = !cover_image_str ? undefined : cover_image_str[1];

    core.debug("Parsing article series...");
    const series_str = frontMatter.match(createPattern("series"));
    const series = !series_str ? undefined : series_str[1];

    core.debug("Parsing article canonical url...");
    const canonical_url_str = frontMatter.match(createPattern("canonical_url"));
    const canonical_url = !canonical_url_str ? undefined : canonical_url_str[1];

    core.debug("Parsing article tags...");
    let tags: string[] = [];
    const tags_string = frontMatter.match(createPattern("tags"));
    if (tags_string) {
      tags = parseAsArray(tags_string[1]);
    }

    core.debug("Parsing article body_markdown...");
    const body_markdown = data
      .replace(frontMatter, "<!-- remove me -->")
      .replace("---\n<!-- remove me -->\n---\n", "");

    return {
      title: title,
      description: description,
      published: published,
      body_markdown: body_markdown,
      cover_image: cover_image,
      tags: tags,
      canonical_url: canonical_url,
      series: series
    };
  } else {
    core.warning("dev.to Front-Matter not found. Ignoring this file.");
    core.info(
      "By adding this file name to `ignore` list to prevent from sync."
    );
    return;
  }
};
export { parseFrontMatter };
