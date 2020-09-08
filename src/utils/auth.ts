import { debug } from "@actions/core";

const isAuth = false;

export async function authenticate(token: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    debug(token);
    resolve(isAuth);
    if (token === "") {
      reject(new Error("Token not be empty"));
    }
  });
}
