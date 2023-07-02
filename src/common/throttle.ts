export function throttle(delay: number) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    let wait = false;
    return (...args: Parameters<typeof fn>) => {
      if (wait) {
        return;
      }

      const result = fn(...args);
      wait = true;

      setTimeout(() => {
        wait = false;
      }, delay);

      return result;
    };
  };
}
