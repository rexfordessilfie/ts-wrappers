import test from "ava";
import { validated } from "../src";
import { z } from "zod";

test("maintains reference to this", async (t) => {
  const store = {
    val: 0,
    validatedInc: validated(
      [],
      z.number(),
    )(function (this: any) {
      return ++this.val;
    }),
  };

  store.validatedInc();
  store.validatedInc();

  t.is(store.val, 2);
});

test("maintains function properties", async (t) => {
  function func(a: string) {}

  func.prototype.foo = "bar";

  const validatedFunc = validated([z.string()])(func);

  t.is(validatedFunc.name, "func");
  t.is(validatedFunc.length, 1);
  t.is(validatedFunc.prototype.foo, "bar");
});

test("allows unspecified validators for optional arguments", async (t) => {
  let val = 0;
  let letters = "";

  function incBy(num: number, letter?: string) {
    val += num;
    letters += letter ?? "";
    return num;
  }

  incBy.prototype.foo = "bar";

  const validatedIncBy = validated([z.number()], z.number())(incBy);

  validatedIncBy(10, "a");
  validatedIncBy(10, "b");

  t.is(val, 20);
  t.is(letters, "ab");
});

test("requires validator for all required args", async (t) => {
  let val = 0;
  let letters = "";

  function incBy(num: number, letter?: string) {
    val += num;
    letters += letter ?? "";
    return num;
  }

  incBy.prototype.foo = "bar";

  const validatedIncBy = validated(
    [z.number(), z.string(), z.number()],
    z.number(),
  )((a, b) => {
    return 2;
  });

  validatedIncBy(10, "a");

  t.is(true, true);
});
