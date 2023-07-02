export const trace =
  <FArgs extends any[], FReturn>(fn: (...args: FArgs) => FReturn) =>
  (...args: Parameters<typeof fn>) => {
    const tag = `${fn.name}(${args}) | duration`;
    console.time(tag);
    const result = fn(...args);
    console.timeEnd(tag);
    return result;
  };
