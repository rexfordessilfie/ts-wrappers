export function memoize<H extends (...args: any[]) => string | number | symbol>(
  hash: H,
  cache = Object.create(null)
) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      const key = hash(...args);
      if (!(key in cache)) {
        // @ts-ignore TS2683
        cache[key] = fn.apply(this, args);
      }
      return cache[key] as ReturnType<typeof fn>;
    };
}
