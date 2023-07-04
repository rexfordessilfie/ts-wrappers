export function debounce(wait = 300, leading = false) {
  let timeout: any;
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    function (...args: Parameters<typeof fn>) {
      return new Promise<ReturnType<typeof fn>>(
        async (resolve: any, reject: any) => {
          // @ts-ignore TS2683
          const next = () => fn.apply(this, args);
          clearTimeout(timeout);

          leading && !timeout && resolve(await next());
          timeout = setTimeout(async () => {
            try {
              timeout = null;
              !leading && resolve(next());
            } catch (e) {
              reject(e);
            }
          }, wait);
        }
      );
    };
}
