import { delayStrategy, retry, trace } from "../src";

export function demo() {
  function randInt(max: number) {
    return Math.ceil(Math.random() * (max + 1));
  }

  async function log(...args: Parameters<typeof console.log>) {
    if (randInt(3) < 3 / 2) {
      // Fail 50% of the time
      throw new Error("Log failed!");
    }

    return console.log(...args);
  }

  const logWithRetry = trace(retry(3)(log));

  logWithRetry("Hi from retry!").catch((e) => console.log(e));
}

export function demoDelayStrategy() {
  const MAX_ATTEMPTS = 2;
  let attempt = 1;

  async function buggyLog(...args: Parameters<typeof console.log>) {
    if (attempt < MAX_ATTEMPTS) {
      // Fail 50% of the time
      throw new Error(`Log failed! Attempt:${attempt++}`);
    }
    console.log(...args);
    return args.length;
  }

  const buggyLogWithRetry = trace(
    retry(MAX_ATTEMPTS, delayStrategy.exponential())(buggyLog)
  );

  buggyLogWithRetry("Hi from retry (strategy)!")
    .then((r) => {
      console.log("result:", r);
    })
    .catch((e) => console.log(e));
}

demo();
demoDelayStrategy();
