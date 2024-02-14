import { trace } from "../src";

function add(a: number, b: number) {
  return a + b;
}

export function demo() {
  const tracedAdd = trace(add);

  console.log(tracedAdd(4, 5));
  console.log(tracedAdd(3, 5));
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
  const tracedMyFn = trace(myFn);
  tracedMyFn(5, 6);
  tracedMyFn(false);
}

demo();
demo2();
