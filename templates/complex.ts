export function complex(initial: number) {
  return <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) => {
    return function newFn(...args: Parameters<typeof fn>) {
      const result = fn(...args);
      return result;
    };
  };
}
