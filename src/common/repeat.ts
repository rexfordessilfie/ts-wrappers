export const repeat = (times: number, delay = 500) => {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      let numTimes = 0;
      const interval = setInterval(() => {
        numTimes++;
        if (numTimes >= times) {
          clearInterval(interval);
        }
        // @ts-ignore TS2683
        fn.apply(this, args);
      }, delay);
    };
};
