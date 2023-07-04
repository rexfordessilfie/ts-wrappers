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
