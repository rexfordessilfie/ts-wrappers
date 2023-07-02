export const once = <FArgs extends any[], FReturn>(
  fn: (...args: FArgs) => FReturn
) => {
  let executed = false;
  return (...args: Parameters<typeof fn>) => {
    if (!executed) {
      executed = true;
      return fn(...args);
    }
  };
};
