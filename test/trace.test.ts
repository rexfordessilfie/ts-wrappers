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
