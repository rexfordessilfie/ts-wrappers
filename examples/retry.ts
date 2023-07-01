import wrapper from "../src";

export const retry = (times: number, delay = 500) => {
  return wrapper((next, ..._: any[]) => {
    let attempts = 0;
    return new Promise<ReturnType<typeof next>>((resolve, reject) => {
      const interval = setInterval(() => {
        attempts += 1;
        try {
          const result = next();
          resolve(result);

          if (attempts <= times) {
            clearInterval(interval);
          }
        } catch (e) {
          if (attempts >= times) {
            reject(e);
            clearInterval(interval);
          }
        }
      }, delay);
    });
  });
};

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

  logWithRetry().catch((e) => console.log(e));
}

demo();
