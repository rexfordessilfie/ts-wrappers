export function complex(_initial: number) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    function newFn(this: any, ...args: Parameters<typeof fn>) {
      return fn.apply(this, args);
    }

    // Copy properties to new function
    Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
      ([prop, descriptor]) => {
        Object.defineProperty(newFn, prop, descriptor);
      }
    );

    return newFn;
  };
}
