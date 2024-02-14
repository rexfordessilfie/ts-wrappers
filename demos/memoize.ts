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

// Demo with overloaded functions

function myFn(a: boolean): string | number;
function myFn<T, U>(a: T, b: U): T | U;

function myFn(...args: unknown[]) {
  if (!Array.isArray(args)) {
    throw new Error("Invalid arguments");
  }

  if (typeof args[0] === "boolean") {
    return "hello";
  }

  return args[0];
}

export function demo2() {
  console.log("demo2");
  const memoizedMyFn = memoize((...args: any[]) => args.slice().join())(myFn);
  console.log(memoizedMyFn(5, 6));
  console.log(memoizedMyFn(false));
}

demo();
demo2();
