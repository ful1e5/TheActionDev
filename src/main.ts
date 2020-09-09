import * as core from "@actions/core";
import { DevAPI } from "./api/DevApi";

export const run = async (): Promise<void> => {
  try {
    const token: string = core.getInput("token", { required: true });

    const api = new DevAPI(token);
    const lists = await api.list();
    console.log(lists);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
