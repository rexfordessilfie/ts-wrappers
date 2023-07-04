import { AsyncLocalStorage } from "async_hooks";

export function als<T, IArgs extends any[]>(
  storage: AsyncLocalStorage<T>,
  init: (...args: IArgs) => T
) {
  return function <FArgs extends IArgs, FReturn>(
    fn: (...args: FArgs) => FReturn
  ) {
    return function (...args: Parameters<typeof fn>) {
      // @ts-ignore TS2683
      const result = storage.run(init(...args), fn.bind(this), ...args);
      return result;
    };
  };
}
