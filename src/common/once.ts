export const once = <FArgs extends any[], FReturn>(
  fn: (...args: FArgs) => FReturn
) => {
  let executed = false;
  return function (...args: Parameters<typeof fn>) {
    if (!executed) {
      executed = true;
      // @ts-ignore TS2683
      return fn.apply(this, args);
    }
  };
};
