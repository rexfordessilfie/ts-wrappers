import test from "ava";
import { memoize } from "../src";

function hash(...args: any[]) {
  return args;
}

test("maintains reference to this", async (t) => {
  function hash(...args: any[]) {
    return args;
  }

  const data = {
    val: 1,
    add: memoize(hash)(function (this: any, x: number) {
      return this.val + x;
    }),
  };

  t.is(data.add(1), 2);
});

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const memoizedIncBy = memoize(hash)(incBy);

  memoizedIncBy(10);

  t.is(val, 10);
  t.is(memoizedIncBy.name, "incBy");
  t.is(memoizedIncBy.length, 2);
  t.is(memoizedIncBy.prototype.foo, "bar");
});

test("populates cache after invocation", async (t) => {
  let cache: Record<string, any> = {};

  const data = {
    offset: 1,
    add: memoize(
      hash,
      cache
    )(function (this: any, x: number) {
      return this.offset + x;
    }),
  };

  t.is(data.add(1), 2);
  t.is(cache[1], 2);

  t.is(data.add(2), 3);
  t.is(cache[2], 3);

  t.is(data.add(3), 4);
  t.is(cache[3], 4);
});

test("memoizes recursive function calls", (t) => {
  let cache: Record<string, number> = {};

  let fib = function (n: number): number {
    return n < 2 ? n : fib(n - 2) + fib(n - 1);
  };

  fib = memoize(hash, cache)(fib);

  t.is(fib(10), 55);
  for (let i = 0; i < 10; i++) {
    t.assert(i in cache);
  }
});
