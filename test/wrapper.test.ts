import test from "ava";
import wrapper from "../src";

import { expectType } from "tsd";

test("has defulat export", (t) => {
  t.truthy(wrapper);
});

test("maintains reference to this", (t) => {
  const through = wrapper(function (this: any, fn, ...args: any[]) {
    t.is(this.val, 1); // Can access 'this' within the callback
    return fn.apply(this, args);
  });

  const data = {
    val: 1,
    getVal: through(function (this: any) {
      return this.val as number; // Can access 'this' inside the function
    }),
  };

  t.is(data.getVal(), 1);
});

test("infers function types from wrapper", (t) => {
  const doubleBinNumOp = wrapper((fn, a: number, b: number) => {
    const next = () => fn(a, b);
    next();
    return next();
  });

  let count = 0;

  const addDouble = doubleBinNumOp((a, b) => {
    count += 1;
    return a + b;
  });

  t.is(addDouble(2, 3), 5);
  t.is(count, 2);
});

test("rejects mismatched function argument type", (t) => {
  const doubleBinNumOp = wrapper((fn, a: number, b: number) => {
    const next = () => fn(a, b);
    next();
    return next();
  });

  const badFunc = (a: string, b: string) => {
    return a + b;
  };

  // This should have an error since types do not match
  doubleBinNumOp(badFunc);

  t.truthy(true);
});

test("allows function args to extend wrapper args", (t) => {
  const withId = wrapper((fn, ctx: { id?: string }, ...args: any[]) => {
    ctx.id = "1234";
    return fn(ctx, ...args);
  });

  const goodFunc = (ctx: { id?: string; name: string }, _color: string) => {
    return ctx;
  };

  const goodFuncWithId = withId(goodFunc);

  t.deepEqual(goodFuncWithId({ name: "Rex" }, "red"), {
    name: "Rex",
    id: "1234",
  });
});

test("infers wrapper return type when applied", (t) => {
  const withRandom = wrapper((fn, ...args: any[]) => {
    const rand = Math.random();

    if (rand > 0.2) {
      return "hi";
    }

    if (rand > 0.5) {
      return "hello";
    }

    return fn(...args);
  });

  const greet = () => "yo" as "yo";

  const greetRandomized = withRandom(greet);

  expectType<"hi" | "hello" | "yo">(greetRandomized());
  t.truthy(["hi", "hello", "yo"].includes(greetRandomized()));
});

test("can type the fn return in wrapper definition", (t) => {
  class ApiKey {
    note: string;
    key: string;

    constructor(note: string, key: string) {
      this.note = note;
      this.key = key;
    }
  }

  const sanitizedApiKey = wrapper((fn, ...args: any[]) => {
    const result = fn<ApiKey>(...args);
    if (!(result instanceof ApiKey)) {
      return result;
    }

    return new Proxy(result, {
      get(target, prop, receiver) {
        if (prop === "key") {
          return (
            target.key.slice(0, 3) +
            new Array(target.key.slice(3).length).fill("*").join("")
          );
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  });

  const createApiKey = (note: string, key: string) => new ApiKey(note, key);

  const createApiKeySanitized = sanitizedApiKey(createApiKey);

  const apiKey = createApiKeySanitized("test key", "abc1234");

  t.is(apiKey.key, "abc****");
  t.is(apiKey.note, "test key");
});

test("can invoke internal function", (t) => {
  const negateUnaryNumericOp = wrapper((fn, num: number) => {
    return fn(-num);
  });

  const double = (num: number) => 2 * num;

  const doubleNegate = negateUnaryNumericOp(double);
  const ceilNegate = negateUnaryNumericOp(Math.ceil);

  t.is(double(4), 8);

  t.is(doubleNegate(4), -8);
  t.is(ceilNegate(7.5), -7);
});
