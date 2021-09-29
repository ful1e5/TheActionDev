import fs from "fs";
import * as glob from "@actions/glob";
import * as core from "@actions/core";
import { parseFrontMatter } from "../utils/parseFrontMatter";

import { Article } from "../types";

export class LocalArticleApi {
  // Ignoring GitHub Markdowns
  private _ignorePattern: string[] = [
    "!**/README.md",
    "!**/CONTRIBUTING.md",
    "!**/CODE_OF_CONDUCT.md",
    "!**/CHANGELOG.md",
    "!**/ISSUE_TEMPLATE/**.md",
    "!**/PULL_REQUEST_TEMPLATE.md"
  ];

  constructor(ignoreFiles?: string[]) {
    if (ignoreFiles) {
      const userIgnorePattern = ignoreFiles.map(file => `!**/${file}`);
      this._ignorePattern.push(...userIgnorePattern);
    }
  }

  public async files(directoryPath: string): Promise<string[]> {
    const mdPattern = `${directoryPath}/**.md`;
    const pattern = [mdPattern, ...this._ignorePattern];

    const globber = await glob.create(pattern.join("\n"), {
      followSymbolicLinks: true
    });
    const files = await globber.glob();

    return files;
  }

  public parse(filePath: string): Article | undefined {
    core.info("Reading file content...");
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });

    return parseFrontMatter(data);
  }
}
