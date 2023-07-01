import wrapper from "../src";

export function throttle(delay: number) {
  let wait = false;

  return wrapper((next, ..._: any[]) => {
    if (wait) {
      return;
    }

    const result = next();
    wait = true;

    setTimeout(() => {
      wait = false;
    }, delay);

    return result;
  });
}

export function demo() {
  const throttledLog = throttle(300)(console.count);

  const interval = setInterval(() => {
    console.count("Hi!");
    throttledLog("Hi throttled!");
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
  }, 1000);
}

demo();
