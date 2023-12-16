import { Any } from "src/common/types";

export function memoize<H extends Any.Function>(
  hash: H,
  cache = Object.create(null)
): <Fn extends Any.Function>(fn: Fn) => Fn {
  return (fn) => {
    function newFn(...args: Parameters<typeof fn>) {
      // @ts-expect-error TS2683
      const key = hash.apply(this, args);
      if (!(key in cache)) {
        // @ts-expect-error TS2683
        cache[key] = fn.apply(this, args);
      }
      return cache[key] as ReturnType<typeof fn>;
    }

    // Copy properties to new function
    Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
      ([prop, descriptor]) => {
        Object.defineProperty(newFn, prop, descriptor);
      }
    );

    return newFn as never;
  };
}
