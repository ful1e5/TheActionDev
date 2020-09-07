import core from "@actions/core";
import { authenticate } from "./utils/auth";

async function run(): Promise<void> {
  try {
    const token: string = core.getInput("token");
    authenticate(token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
