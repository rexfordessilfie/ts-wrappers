import { AsyncLocalStorage } from "node:async_hooks";

export function als<T, IArgs extends any[]>(
  storage: AsyncLocalStorage<T>,
  init: (...args: IArgs) => T
) {
  return function <FArgs extends IArgs, FReturn>(
    fn: (...args: FArgs) => FReturn
  ) {
    function newFn(...args: Parameters<typeof fn>) {
      // @ts-ignore TS2683
      const result = storage.run(init(...args), fn.bind(this), ...args);
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
}
