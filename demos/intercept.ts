import { intercept } from "../src";

export function demo() {
  function logArgs(...args: Parameters<typeof console.log>) {
    console.log(`intercepted! args: (${args.join(", ")})`);
  }

  function add(a: number, b: number) {
    return a + b;
  }

  const interceptedAdd = intercept(logArgs)(add);

  const result = interceptedAdd(2, 3);

  console.log("result: ", result);
}

demo();
