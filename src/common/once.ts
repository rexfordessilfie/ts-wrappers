export const once = <FArgs extends any[], FReturn>(
  fn: (...args: FArgs) => FReturn
) => {
  let executed = false;
  function newFn(...args: Parameters<typeof fn>) {
    if (!executed) {
      executed = true;
      // @ts-ignore TS2683
      return fn.apply(this, args);
    }
  }

  // Copy properties to new function
  Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
    ([prop, descriptor]) => {
      Object.defineProperty(newFn, prop, descriptor);
    }
  );

  return newFn;
};
