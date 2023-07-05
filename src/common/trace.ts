export const trace = <FArgs extends any[], FReturn>(
  fn: (...args: FArgs) => FReturn
) => {
  function newFn(...args: Parameters<typeof fn>) {
    const tag = `${fn.name}(${args}) | duration`;
    console.time(tag);
    // @ts-ignore TS2683
    const result = fn.apply(this, args);
    console.timeEnd(tag);
    return result;
  }

  // Copy properties to new function
  Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
    ([prop, descriptor]) => {
      Object.defineProperty(newFn, prop, descriptor);
    }
  );

  return newFn;
};
