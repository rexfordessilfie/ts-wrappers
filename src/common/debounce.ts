export function debounce(wait = 300, leading = false) {
  let timeout: any;
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    (...args: Parameters<typeof fn>) => {
      return new Promise<ReturnType<typeof fn>>((resolve, reject) => {
        clearTimeout(timeout);

        leading && !timeout && resolve(fn(...args));
        timeout = setTimeout(async () => {
          try {
            timeout = null;
            !leading && resolve(await fn(...args));
          } catch (e) {
            reject(e);
          }
        }, wait);
      });
    };
}
