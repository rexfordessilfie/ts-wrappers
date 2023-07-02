import { memoize, trace } from "../src";

export function demo() {
  let fib = function (n: number): number {
    return n < 2 ? n : fib(n - 2) + fib(n - 1);
  };

  const hash = (...args: any[]) => {
    return args.slice().join("-");
  };

  // Redefining is super important here so it is memoized for recursive calls
  fib = memoize(hash)(fib);

  const tracedFib = trace(fib);

  console.log(tracedFib(10));
  console.log("-----");
  console.log(tracedFib(10));
}

demo();
