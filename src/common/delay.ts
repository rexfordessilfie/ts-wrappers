export function delay(wait: number) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
    (...args: Parameters<typeof fn>) => {
      return new Promise<ReturnType<typeof fn>>((resolve) => {
        setTimeout(() => {
          resolve(fn(...args));
        }, wait);
      });
    };
}
