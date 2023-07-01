import wrapper, { FUNC } from "../src";

export function memoize<F extends Function>(
  hash: F,
  cache = Object.create(null)
) {
  return wrapper((next, ...args: any[]) => {
    const key = hash(...args);

    if (!(key in cache)) {
      cache[key] = next();
    } else {
      console.log(`returning cached result for ${next[FUNC].name}(${args[0]})`);
    }

    return cache[key] as ReturnType<typeof next>;
  });
}

export function demo() {
  let fib = (n: number): number => {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
  };

  const hash = (...args: any[]) => {
    return args.slice().join("-");
  };

  // Redefining is super important here so it is memoized for recursive calls
  fib = memoize(hash)(fib);

  console.log(fib(10));

  // All these are memoized!
  console.log(fib(9));
  console.log(fib(7));
  console.log(fib(5));
}

demo();
