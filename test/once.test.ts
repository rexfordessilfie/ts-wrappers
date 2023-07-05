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

test("maintains function properties", async (t) => {
  let val = 0;

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const onceIncBy = once(incBy);

  onceIncBy(10);

  t.is(val, 10);
  t.is(onceIncBy.name, "incBy");
  t.is(onceIncBy.length, 2);
  t.is(onceIncBy.prototype.foo, "bar");
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
