import wrapper from "../src";
import { trace } from "./trace";

export function memoize<H extends (...args: any[]) => string | number | symbol>(
  hash: H,
  cache = Object.create(null)
) {
  return wrapper((next, ...args: any[]) => {
    const key = hash(...args);
    if (!(key in cache)) {
      cache[key] = next();
    }
    return cache[key] as ReturnType<typeof next>;
  });
}

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
