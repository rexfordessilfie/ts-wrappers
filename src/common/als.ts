import { AsyncLocalStorage } from "async_hooks";

export function als<T, FArgs extends any[]>(
  storage: AsyncLocalStorage<T>,
  init: (...args: FArgs) => T
) {
  return <FFArgs extends FArgs, FReturn>(fn: (...args: FFArgs) => FReturn) => {
    return function newFn(...args: Parameters<typeof fn>) {
      const result = storage.run(init(...args), fn, ...args);
      return result;
    };
  };
}
