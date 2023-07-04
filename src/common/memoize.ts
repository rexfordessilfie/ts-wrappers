export function memoize<H extends (...args: any[]) => any>(
  hash: H,
  cache = Object.create(null)
) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    function newFn(...args: Parameters<typeof fn>) {
      // @ts-ignore TS2683
      const key = hash.apply(this, args);
      if (!(key in cache)) {
        // @ts-ignore TS2683
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

    return newFn;
  };
}
