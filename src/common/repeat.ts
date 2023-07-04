export const repeat = (times: number, delay = 0) => {
  let current = times;
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      return new Promise<void>((resolve) => {
        const interval = setInterval(async () => {
          current--;

          let result = undefined;

          try {
            // @ts-ignore TS2683
            result = await fn.apply(this, args);
          } catch (e) {
            console.error(e);
          }

          if (current === 0) {
            resolve();
            clearInterval(interval);
          }
        }, delay);
      });
    };
};
