import { sleep } from "../sleep";

export const retry = (times: number, delay = 0) => {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    async function newFn(...args: Parameters<typeof fn>) {
      for (let attempt = 1; attempt <= times; attempt++) {
        try {
          // @ts-ignore TS2683
          const result = await fn.apply(this, args);
          return result;
        } catch (e) {
          if (attempt >= times) {
            throw e;
          }
          await sleep(delay);
        }
      }
    }

    // Copy properties to new function
    Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
      ([prop, descriptor]) => {
        Object.defineProperty(newFn, prop, descriptor);
      }
    );

    return newFn;
  };
};
