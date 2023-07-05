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

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const delayedIncBy = delay(0)(incBy);

  await delayedIncBy(10);

  t.is(val, 10);
  t.is(delayedIncBy.name, "incBy");
  t.is(delayedIncBy.length, 2);
  t.is(delayedIncBy.prototype.foo, "bar");
});

test("delays function invocation", async (t) => {
  function inc(this: any) {
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
