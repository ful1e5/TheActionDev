import * as core from "@actions/core";

import { parseAsArray } from "./parseAsArray";

export const getInputAsArray = (name: string, required?: boolean): string[] => {
  const input = core.getInput(name, { required });
  return parseAsArray(input);
};
