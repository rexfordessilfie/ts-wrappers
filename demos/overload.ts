export const once = <Fn extends (...args: any[]) => any>(fn: Fn) => {
  function newFn(this: any, ...args: any[]) {
    if (Math.random() > 0.5) {
      return true;
    }
    return fn.apply(this, args);
  }

  // Copy properties to new function
  Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
    ([prop, descriptor]) => {
      Object.defineProperty(newFn, prop, descriptor);
    }
  );

  return newFn as Fn;
};

declare function overloaded(arg1: string, arg2: number): number;
declare function overloaded(arg1: string): string;

const wrappedOverloaded = once(overloaded);

wrappedOverloaded("");
wrappedOverloaded("", 2);
