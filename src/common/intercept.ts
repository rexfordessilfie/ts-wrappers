export function intercept<F extends Function>(interceptor: F) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    (...args: Parameters<typeof fn>) => {
      interceptor(...args);
      return fn(...args);
    };
}
