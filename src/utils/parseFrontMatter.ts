import * as core from "@actions/core";
import YAML from "js-yaml";

import { Article } from "../types";

interface YamlTableType {
  title?: string;
  description?: string;
  published?: boolean | Date;
  body_markdown?: string;
  cover_image?: string;
  tags?: string[];
  canonical_url?: string;
  series?: string;
  organization_id?: number;
}

const parseFrontMatter = (data: string): Article | undefined => {
  core.info("Parsing Front-Matter...");
  const reg = /^\s*\-{3}\n([\s\S]*?)\n\-{3}/;
  const frontMatter = data.match(reg);

  if (frontMatter != null) {
    const yt = YAML.load(frontMatter[1]) as YamlTableType;

    // We are checking title's null value here.
    // Other values are checked by Request handler (got).
    const title = yt.title;
    if (title == null) {
      core.error("Unable to find article title.");
      return;
    }

    // Filtering null, undefined and 0 values from array
    let tags: string[] = [];
    if (yt.tags) {
      tags = yt.tags.filter((e: string) => e);
    }

    let published: boolean
    if(yt.published instanceof Date) {
      published = yt.published <= new Date();
    }
    else {
      published = yt.published || false
    }

    // Removing front-matter and returning body of markdown without blanklines('\n') in front.
    const body_markdown = data.replace(reg, "").trim();

    return {
      title: title,
      description: yt.description,
      published: published,
      body_markdown: body_markdown,
      main_image: yt.cover_image,
      tags: tags,
      canonical_url: yt.canonical_url,
      series: yt.series,
      organization_id: yt.organization_id
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
