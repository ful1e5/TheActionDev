import * as core from "@actions/core";

const isAuth = false;

/**
 *
 * @param token dev.to api token
 *
 */
export const authenticate = async (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    core.info(token);
    resolve(isAuth);
    if (token === "") {
      reject(new Error("Token not be empty"));
    }
  });
};
