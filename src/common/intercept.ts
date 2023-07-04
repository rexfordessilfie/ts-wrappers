export function intercept<F extends Function>(interceptor: F) {
  return function <FArgs extends any[], FReturn>(
    fn: (...args: FArgs) => FReturn
  ) {
    return function (...args: Parameters<typeof fn>) {
      // @ts-ignore TS2683
      interceptor.apply(this, args);
      // @ts-ignore TS2683
      return fn.apply(this, args);
    };
  };
}
