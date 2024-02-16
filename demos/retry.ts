import { delayStrategy, retry, trace } from "../src";

export function demo() {
  function randInt(max: number) {
    return Math.ceil(Math.random() * (max + 1));
  }

  async function log(...args: any[]) {
    if (randInt(3) < 3 / 2) {
      // Fail 50% of the time
      throw new Error("Log failed!");
    }
    console.log(...args);
  }

  const logWithRetry = trace(retry(3)(log));

  logWithRetry("Hi from retry!").catch((e) => console.log(e));
}

export function demoDelayStrategy() {
  const MAX_ATTEMPTS = 2;
  let attempt = 1;

  const buggyLog = async (...args: any[]) => {
    if (attempt < MAX_ATTEMPTS) {
      throw new Error(`Log failed! Attempt:${attempt++}`);
    }
    console.log(...args);
    return args.length;
  };

  const buggyLogWithRetry = trace(
    retry(MAX_ATTEMPTS, delayStrategy.exponential())(buggyLog)
  );

  buggyLogWithRetry("Hi from retry (strategy)!")
    .then((r) => {
      console.log("args.length:", r);
    })
    .catch((e) => console.log(e));
}

demo();
demoDelayStrategy();
