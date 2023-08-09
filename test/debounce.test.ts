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

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const debouncedIncBy = debounce(0)(incBy);

  await debouncedIncBy(10);

  t.is(val, 10);
  t.is(debouncedIncBy.name, "incBy");
  t.is(debouncedIncBy.length, 2);
  t.is(debouncedIncBy.prototype.foo, "bar");
});

test("debounces with promise then", async (t) => {
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

test("debounces with leading", async (t) => {
  let val = 0;
  function inc() {
    val++;
  }

  const debouncedInc = debounce(100, { leading: true })(inc);

  debouncedInc();
  t.is(val, 1);
  await sleep(200);
  debouncedInc();
  debouncedInc();
  await sleep(200);
  t.is(val, 2);
});

test("debounces keyed function", async (t) => {
  function incBy(this: any, num = 1) {
    this.val += num;
  }

  const store = {
    val: 0,
    debouncedIncBy: debounce(40, {
      keyFn: (...args: any[]) => {
        // using any here to let types of eventual function to passthrough
        return args[0];
      },
    })(incBy),
  };

  store.debouncedIncBy(1);
  await sleep(30); // Don't wait for long, then issue new operation to cancel first
  store.debouncedIncBy(1);

  store.debouncedIncBy(2); // Issue new operation but should not cancel other
  await sleep(30);
  store.debouncedIncBy(2); // Issue new operation before function can execute

  await sleep(50); // Wait for remaining operations to complete

  t.is(store.val, 3);
});
