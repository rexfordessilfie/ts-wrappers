import test from "ava";
import { throttle } from "../src";

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

test("maintains reference to this", async (t) => {
  const store = {
    val: 1,
    throttledInc: throttle(0)(function (this: any) {
      return ++this.val;
    }),
  };

  await store.throttledInc().then((x) => {
    t.is(x, store.val);
  });
});

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const throttledIncBy = throttle(10)(incBy);

  await throttledIncBy(10);

  t.is(val, 10);
  t.is(throttledIncBy.name, "incBy");
  t.is(throttledIncBy.length, 2);
  t.is(throttledIncBy.prototype.foo, "bar");
});

test("throttles fast running operation", async (t) => {
  function inc(this: any) {
    return ++this.val;
  }

  const data = {
    val: 0,
    throttledInc: throttle(50)(inc),
  };

  for (let i = 0; i < 10; i++) {
    const oldVal = data.val;

    await data.throttledInc().then((x) => {
      if (x) {
        t.is(x, data.val);
        t.truthy(data.val > oldVal, "Expected increment");
      }
    });

    await sleep(25);
  }

  t.is(data.val, 5);
});

test("throttle with throwing errors", async (t) => {
  let val = 0;
  let callCount = 0;

  const DELAY = 10;

  const throttledInc = throttle(DELAY)(() => {
    callCount += 1;
    if (callCount % 2 == 0) {
      throw new Error("Error!");
    }
    return ++val;
  });

  for (let i = 0; i < 10; i++) {
    let oldVal = val;

    if ((callCount + 1) % 2 == 0) {
      // function hasnt been executed yet
      await t.throwsAsync(() => throttledInc());
    } else {
      t.notThrowsAsync(() =>
        throttledInc().then(() => {
          // No need to conditionally check for presence of x since we decided to
          // wait for long enough not to trigger a throttle
          t.assert(val > oldVal, "Expected increment");
        })
      );
    }

    // Wait for longer than would be required to have to throttle
    await sleep(DELAY + 10);
  }

  t.is(val, 5);
});
