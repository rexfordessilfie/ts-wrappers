import wrapper from "../../src";

export const complex = (initial: number) => {
  return wrapper((fn, ...args: any[]) => {
    const result = fn(...args);
    return result;
  });
};
