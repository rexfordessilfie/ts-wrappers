import test from "ava";
import { delay } from "../src";

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// IDEA: add prev wrapper that caches the result of the last function invocation in a `ref` object

test("maintains reference to this", async (t) => {
  const data = {
    val: 1,
    delayedInc: delay(0)(function (this: any) {
      return ++this.val;
    }),
  };

  await data.delayedInc().then((x) => {
    t.is(x, data.val);
  });
});

test("delays function invocation", async (t) => {
  function inc() {
    this.val++;
  }

  const data = {
    val: 0,
    delayedInc: delay(400)(inc),
  };

  const oldVal = data.val;

  const start = performance.now();
  await data.delayedInc().then(() => {
    t.truthy(data.val > oldVal, "expected increment");
  });
  const end = performance.now();
  const duration = end - start;

  t.is(data.val, 1);
  t.assert(Math.round(duration / 10) * 10 >= 400);
});
