export function debounce(wait = 300, leading = false) {
  let timeout: any;
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      return new Promise<Awaited<ReturnType<typeof fn>>>(
        async (resolve: any, reject: any) => {
          clearTimeout(timeout);

          // @ts-ignore TS2683
          leading && !timeout && resolve(await fn.apply(this, args));
          timeout = setTimeout(async () => {
            try {
              timeout = null;
              // @ts-ignore TS2683
              !leading && resolve(await fn.apply(this, args));
            } catch (e) {
              reject(e);
            }
          }, wait);
        }
      );
    };
}
