export function delay(wait: number) {
  return function <FArgs extends any[], FReturn>(
    fn: (...args: FArgs) => FReturn
  ) {
    function newFn(...args: Parameters<typeof fn>) {
      return new Promise<ReturnType<typeof fn>>((resolve) => {
        setTimeout(() => {
          // @ts-ignore TS2683
          resolve(fn.apply(this, args));
        }, wait);
      });
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
