import test from "ava";
import { intercept } from "../src";

test("maintains reference to this", async (t) => {
  let intercepted = false;
  function exec() {
    intercepted = true;
  }

  const data = {
    val: 1,
    get: intercept(exec)(function (this: any) {
      this.val;
    }),
  };

  data.get();

  t.is(data.val, 1);
  t.is(intercepted, true);
});

test("maintains function properties", async (t) => {
  let val = 0;

  function exec(..._args: any[]) {}

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const interceptedIncBy = intercept(exec)(incBy);

  await interceptedIncBy(10);

  t.is(val, 10);
  t.is(interceptedIncBy.name, "incBy");
  t.is(interceptedIncBy.length, 2);
  t.is(interceptedIncBy.prototype.foo, "bar");
});

test("allows async interception with throw", async (t) => {
  let intercepted = false;

  function exec() {
    intercepted = true;
    return new Promise((_, reject) => {
      reject(new Error("Hello"));
    });
  }

  const data = {
    val: 1,
    get: intercept(exec)(function (this: any) {
      this.val;
    }),
  };

  await t.throwsAsync(async () => data.get());

  t.is(data.val, 1);
  t.is(intercepted, true);
});
