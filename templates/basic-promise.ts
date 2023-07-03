export const basic = <FArgs extends any[], FReturn>(
  fn: (...args: FArgs) => FReturn
) => {
  return function newFn(...args: Parameters<typeof fn>) {
    return new Promise<ReturnType<typeof fn>>(async (resolve, reject) => {
      try {
        const result = await fn(...args);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  };
};
