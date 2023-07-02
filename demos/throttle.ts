import { throttle } from "../src";

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
