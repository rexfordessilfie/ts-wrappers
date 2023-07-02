import { retry } from "../src";

export function demo() {
  function randInt(max: number) {
    return Math.ceil(Math.random() * (max + 1));
  }

  function log(...args: Parameters<typeof console.log>) {
    if (randInt(3) < 3 / 2) {
      // Fail 50% of the time
      throw new Error("Log failed!");
    }

    return console.log(...args);
  }

  const logWithRetry = retry(3)(log);

  logWithRetry("Hi from retry!").catch((e) => console.log(e));
}

demo();
