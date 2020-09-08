import * as core from "@actions/core";
import { authenticate } from "./utils/auth";

export const run = async (): Promise<void> => {
  try {
    const token: string = core.getInput("token", { required: true });
    await authenticate(token);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
