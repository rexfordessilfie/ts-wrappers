type DebounceOptions<KArgs extends any[]> = {
  leading?: boolean;
  keyFn?: (...args: KArgs) => any;
};

export function debounce<KArgs extends any[]>(
  wait: number,
  options?: DebounceOptions<KArgs>
) {
  const { leading = false, keyFn } = options || {};

  let timeout: any;
  let timeoutKey: any;
  let timeoutCache: Record<string, any>;

  if (keyFn) {
    timeoutCache = {};
  }
  return <FArgs extends KArgs, FReturn>(fn: (...args: FArgs) => FReturn) => {
    function newFn(...args: Parameters<typeof fn>) {
      if (keyFn) {
        // @ts-ignore TS2683
        timeoutKey = keyFn.apply(this, args);
        timeout = timeoutCache[timeoutKey];
      }
      return new Promise<Awaited<ReturnType<typeof fn>>>(
        (resolve: any, reject: any) => {
          if (leading && !timeout) {
            // @ts-ignore TS2683
            (async () => resolve(await fn.apply(this, args)))();
          }

          clearTimeout(timeout);
          timeout = setTimeout(async () => {
            try {
              timeout = null;
              if (!leading) {
                // @ts-ignore TS2683
                resolve(await fn.apply(this, args));
              }
            } catch (e) {
              reject(e);
            }
          }, wait);

          if (keyFn) {
            timeoutCache[timeoutKey] = timeout;
          }
        }
      );
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
