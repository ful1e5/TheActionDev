import * as glob from "@actions/glob";
export class RepoArticlesProvider {
  private async files() {
    const patterns = ["**/dev.md"];
    const globber = await glob.create(patterns.join("\n"));
    return await globber.glob();
  }

  async sync() {
    // TODO
    console.log(await this.files());
    console.log("snying..");
  }
}
