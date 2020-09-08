import { debug } from "@actions/core";

const isAuth = false;

export async function authenticate(token: string): Promise<boolean> {
  return new Promise(resolve => {
    try {
      debug(token);
      resolve(isAuth);
      if (token === "") {
        throw new Error("Invalid Token");
      }
    } catch (error) {
      console.error(error);
    }
  });
}
