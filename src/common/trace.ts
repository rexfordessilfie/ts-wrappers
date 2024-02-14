import type { Any } from "src/common/types";

export const trace = <Fn extends Any.Function>(fn: Fn) => {
  function newFn(...args: Parameters<Fn>) {
    const tag = `${fn.name}(${args}) | duration`;
    console.time(tag);
    // @ts-expect-error TS2683
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

  return newFn as Fn;
};
