export function throttle(delay: number) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    let wait = false;
    return function (...args: Parameters<typeof fn>) {
      if (wait) {
        return;
      }

      // @ts-ignore TS2683
      const result = fn.apply(this, args);
      wait = true;

      setTimeout(() => {
        wait = false;
      }, delay);

      return result;
    };
  };
}
