export function delay(wait: number) {
  return function <FArgs extends any[], FReturn>(
    fn: (...args: FArgs) => FReturn
  ) {
    return function (...args: Parameters<typeof fn>) {
      return new Promise<ReturnType<typeof fn>>((resolve) => {
        setTimeout(() => {
          // @ts-ignore TS2683
          resolve(fn.apply(this, args));
        }, wait);
      });
    };
  };
}
