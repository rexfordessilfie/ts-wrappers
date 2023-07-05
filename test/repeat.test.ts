import test from "ava";
import { repeat } from "../src";

test("maintains reference to this", async (t) => {
  const data = {
    val: 0,
    repeatedInc: repeat(3)(function (this: any) {
      return ++this.val;
    }),
  };

  await data.repeatedInc();

  t.is(data.val, 3);
});

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const repeatedIncBy = repeat(3)(incBy);

  await repeatedIncBy(10);

  t.is(val, 30);
  t.is(repeatedIncBy.name, "incBy");
  t.is(repeatedIncBy.length, 2);
  t.is(repeatedIncBy.prototype.foo, "bar");
});

test("executes repeatedly", async (t) => {
  let currTime: number, prevTime: number;

  let val = 0;

  const repeatedInc = repeat(
    3,
    200
  )(() => {
    [currTime, prevTime] = [performance.now(), currTime];

    if (prevTime) {
      const duration = currTime - prevTime;
      t.assert(Math.round(duration / 10) * 10 >= 200);
    }

    return ++val;
  });

  await repeatedInc();

  t.is(val, 3);
});
