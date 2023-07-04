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
