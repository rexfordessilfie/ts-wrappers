import test from "ava";
import { once } from "../src";

test("maintains reference to this", async (t) => {
  const store = {
    val: 0,
    onceInc: once(function (this: any) {
      this.val++;
    }),
  };

  store.onceInc();

  t.is(store.val, 1);
});

test("only executes once", async (t) => {
  let val = 0;

  const onceInc = once(() => {
    val++;
  });

  onceInc();
  onceInc();
  onceInc();

  t.is(val, 1);
});
