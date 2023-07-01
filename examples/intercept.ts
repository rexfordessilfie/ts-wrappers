import wrapper from "../src";

export function intercept<F extends Function>(interceptor: F) {
  return wrapper((next, ...args: any[]) => {
    interceptor(...args);
    return next();
  });
}

export function demo() {
  function logArgs(...args: Parameters<typeof console.log>) {
    console.log(`args: (${args.join(", ")})`);
  }

  function add(a: number, b: number) {
    return a + b;
  }

  const tracedAdd = intercept(logArgs)(add);

  const result = tracedAdd(2, 3);

  console.log("result: ", result);
}

demo();
