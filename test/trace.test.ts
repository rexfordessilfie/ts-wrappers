import test from "ava";
import { trace } from "../src";

test("maintains reference to this", async (t) => {
  const data = {
    val: 1,
    tracedInc: trace(function inc(this: any) {
      return ++this.val;
    }),
  };

  data.tracedInc();
  t.is(data.val, 2);
});

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const tracedIncBy = trace(incBy);

  tracedIncBy(10);

  t.is(val, 10);
  t.is(tracedIncBy.name, "incBy");
  t.is(tracedIncBy.length, 2);
  t.is(tracedIncBy.prototype.foo, "bar");
});

test("returns correct value for sync functions", async (t) => {
  function inc(x: number) {
    return x + 1;
  }

  const tracedInc = trace(inc);

  t.is(tracedInc(2), 3);
});

test("returns correct value for async functions", async (t) => {
  async function inc(x: number) {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(x + 1);
      }, 1000);
    });
  }

  const tracedInc = trace(inc);

  // with await
  t.is(await tracedInc(2), 3);

  // with chaining
  await tracedInc(2)
    .then((x) => {
      t.is(x, 3);
      return inc(x);
    })
    .then((x) => {
      t.is(x, 4);
    });
});
