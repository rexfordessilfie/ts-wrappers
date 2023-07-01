import wrapper from "../src";

export const repeat = (times: number, delay = 500) => {
  return wrapper((next, ..._: any[]) => {
    let numTimes = 0;
    const interval = setInterval(() => {
      numTimes++;
      if (numTimes >= times) {
        clearInterval(interval);
      }
      next();
    }, delay);
  });
};

export function demo() {
  const logRepeat = repeat(3)(console.log);

  logRepeat("repating"); // Logs 3 times
}

demo();
