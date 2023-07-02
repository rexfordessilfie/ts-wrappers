import { once } from "../src";

export function demo() {
  const logOnce = once(console.log);

  logOnce("hello");
  logOnce("hi"); // Does not log
}

demo();
