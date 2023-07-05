import { sleep } from "../sleep";

export const repeat = (times: number, delay = 0) => {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    async function newFn(...args: Parameters<typeof fn>) {
      for (let i = 0; i < times; i++) {
        let result = undefined;

        try {
          // @ts-ignore TS2683
          result = await fn.apply(this, args);
        } catch (e) {
          console.error(e);
        }

        await sleep(delay);
      }
    }

    return newFn;
  };
};
