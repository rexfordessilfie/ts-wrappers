export const retry = (times: number, delay = 0) => {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      let attempts = 0;
      return new Promise<Awaited<FReturn>>((resolve, reject) => {
        const interval = setInterval(async () => {
          attempts++;
          try {
            // @ts-ignore TS2683
            const result = await fn.apply(this, args);
            resolve(result);
            clearInterval(interval);
          } catch (e) {
            if (attempts >= times) {
              reject(e);
              clearInterval(interval);
            }
          }
        }, delay);
      });
    };
};
