import * as core from "@actions/core";

export const run = async (): Promise<void> => {
  try {
    // const token: string = core.getInput("token", { required: true });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
