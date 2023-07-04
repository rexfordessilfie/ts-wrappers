import test from "ava";
import { debounce } from "../src";

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// IDEA: add prev wrapper that caches the result of the last function invocation in a `ref` object

test("maintains reference to this", async (t) => {
  const store = {
    val: 1,
    debouncedInc: debounce(0)(function (this: any) {
      return ++this.val;
    }),
  };

  await store.debouncedInc().then((x) => {
    t.is(x, store.val);
  });
});

test("debounces fast running operation", async (t) => {
  const durations = [50, 400, 100, 50, 600, 40];

  function inc(this: any) {
    this.val++;
  }

  const store = {
    val: 0,
    debouncedInc: debounce(400)(inc),
  };

  let last: any;

  for (const duration of durations) {
    const oldVal = store.val;

    last = store.debouncedInc().then(() => {
      t.truthy(store.val > oldVal, "Expected increment");
    });

    await sleep(duration);
  }

  await last;

  t.is(store.val, 3);
});
