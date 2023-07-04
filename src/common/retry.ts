async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export const retry = (times: number, delay = 0) => {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    async function (...args: Parameters<typeof fn>) {
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
    };
};
