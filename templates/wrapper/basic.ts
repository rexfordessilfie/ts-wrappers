import wrapper from "../../src";

export const basic = wrapper((fn, ...args: any[]) => {
  const result = fn(...args);
  return result;
});
