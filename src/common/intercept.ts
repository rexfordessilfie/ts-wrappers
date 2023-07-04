export function intercept<IArgs extends any[], IReturn>(
  interceptor: (...args: IArgs) => IReturn
) {
  return function <FArgs extends IArgs, FReturn>(
    fn: (...args: FArgs) => FReturn
  ) {
    return async function (...args: Parameters<typeof fn>) {
      // @ts-ignore TS2683
      await interceptor.apply(this, args);
      // @ts-ignore TS2683
      return fn.apply(this, args);
    };
  };
}
