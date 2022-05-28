import * as core from "@actions/core";
import YAML from "yaml";

import { Article } from "../types";

const parseFrontMatter = (data: string): Article | undefined => {
  core.info("Parsing Front-Matter...");
  const reg = /^\s*\-{3}\n([\s\S]*?)\n\-{3}/;
  const frontMatter = data.match(reg);

  if (frontMatter != null) {
    const yml = YAML.parse(frontMatter[1]);

    // We are checking title's null value here.
    // Other values are checked by Request handler (got).
    const title = yml["title"];
    if (title == null) {
      core.error("Unable to find article title.");
      return;
    }

    // Filtering null, undefined and 0 values from array
    let tags: string[] = [];
    if (yml["tags"]) {
      tags = yml["tags"].filter((e: string) => e);
    }

    // Removing front-matter and returning body of markdown without blanklines('\n') in front.
    const body_markdown = data.replace(reg, "").trim();

    return {
      title: title,
      description: yml["description"],
      published: yml["published"] || false,
      body_markdown: body_markdown,
      cover_image: yml["cover_image"],
      tags: tags,
      canonical_url: yml["canonical_url"],
      series: yml["series"]
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
