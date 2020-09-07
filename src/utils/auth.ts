import { debug } from "@actions/core";

const isAuth = false;

export async function authenticate(token: string): Promise<boolean> {
  return new Promise(resolve => {
    debug(token);
    resolve(isAuth);
  });
}
