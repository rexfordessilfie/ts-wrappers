export const retry = (times: number, delay = 500) => {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      let attempts = 0;
      return new Promise<ReturnType<typeof fn>>((resolve, reject) => {
        const interval = setInterval(() => {
          attempts += 1;
          try {
            // @ts-ignore TS2683
            const result = fn.apply(this, args);
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
    };
};
