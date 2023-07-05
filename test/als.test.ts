import { AsyncLocalStorage } from "async_hooks";
import test from "ava";
import { als } from "../src";

test("maintains reference to this", async (t) => {
  const storage = new AsyncLocalStorage<ReturnType<typeof init>>();
  const init = (x: number) => ({
    x,
  });

  const x = () => {
    return storage.getStore()!.x;
  };

  const data = {
    val: 1,
    incBy: als(
      storage,
      init
    )(function (this: any) {
      return this.val + x();
    }),
  };

  t.is(data.incBy(2), 3);
});

test("maintains function properties", async (t) => {
  let val = 0;

  const init = (..._args: any[]) => -1;
  const storage = new AsyncLocalStorage<number>();

  function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  incBy.prototype.foo = "bar";

  const incByWithAls = als(storage, init)(incBy);

  incByWithAls(10);

  t.is(val, 10);
  t.is(incByWithAls.name, "incBy");
  t.is(incByWithAls.length, 2);
  t.is(incByWithAls.prototype.foo, "bar");
});

test("executes function in async local context", (t) => {
  const init = (..._args: any[]) => -1;
  const storage = new AsyncLocalStorage<number>();

  let executed = false;

  const exec = (x: number) => {
    executed = true;
    t.is(storage.getStore(), -1);
    return x;
  };

  const execWithAls = als(storage, init)(exec);

  t.is(execWithAls(1), 1);
  t.true(executed);
});

test("executes with correct storage at nested levels", (t) => {
  const init = (..._args: any[]) => -1;
  const init2 = (..._args: any[]) => -2;

  const storage = new AsyncLocalStorage<number>();

  const withAls = als(storage, init);
  const withAls2 = als(storage, init2);

  const execWithAls = withAls2((x: number) => {
    t.is(storage.getStore(), -2);

    const inner = withAls((x: number) => {
      t.is(storage.getStore(), -1);
      return x;
    });

    return inner(x);
  });

  t.is(execWithAls(1), 1);
});
