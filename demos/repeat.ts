import { repeat } from "../src";

export function demo() {
  const logRepeat = repeat(3)(console.log);

  logRepeat("repating"); // Logs 3 times
}

demo();
