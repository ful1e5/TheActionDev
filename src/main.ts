import core, { debug } from "@actions/core";
import { authenticate } from "./utils/auth";

async function run(): Promise<void> {
  try {
    const token: string = core.getInput("token");
    const isAuth = authenticate(token);
    debug(`I'm authenticated : ${isAuth}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
