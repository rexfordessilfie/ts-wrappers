export function throttle(delay: number) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    let wait = false;
    async function newFn(...args: Parameters<typeof fn>) {
      if (wait) {
        return;
      }

      wait = true;

      let result: FReturn | undefined = undefined;

      try {
        // @ts-ignore TS2683
        result = await fn.apply(this, args);
      } catch (e) {
        throw e;
      } finally {
        setTimeout(() => {
          wait = false;
        }, delay);
      }

      return result;
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
