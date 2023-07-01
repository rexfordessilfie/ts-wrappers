import test from "ava";
import wrapper, { FUNC } from "../src";

import { expectType } from "tsd";

test("has defulat export", (t) => {
  t.truthy(wrapper);
});

test("infers function types from wrapper", (t) => {
  const doubleBinNumOp = wrapper((next, a: number, b: number) => {
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
  const doubleBinNumOp = wrapper((next, a: number, b: number) => {
    next();
    return next();
  });

  const badFunc = (a: string, b: string) => {
    return a + b;
  };

  // This should have an error
  doubleBinNumOp(badFunc);

  t.truthy(true);
});

test("allows function args to extend wrapper args", (t) => {
  const withId = wrapper((next, ctx: { id?: string }, ..._: any[]) => {
    ctx.id = "1234";
    return next();
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
  const withRandom = wrapper((next, ..._: any[]) => {
    const rand = Math.random();

    if (rand > 0.2) {
      return "hi";
    }

    if (rand > 0.5) {
      return "hello";
    }

    return next();
  });

  const greet = () => "yo" as "yo";

  const greetRandomized = withRandom(greet);

  expectType<"hi" | "hello" | "yo">(greetRandomized());
  t.truthy(["hi", "hello", "yo"].includes(greetRandomized()));
});

test("can type the next return in wrapper definition", (t) => {
  class ApiKey {
    note: string;
    key: string;

    constructor(note: string, key: string) {
      this.note = note;
      this.key = key;
    }
  }

  const sanitizedApiKey = wrapper((next, ..._: any[]) => {
    const result = next<ApiKey>();
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
  const negateUnaryNumericOp = wrapper((next, num: number) => {
    return next[FUNC](-num);
  });

  const double = (num: number) => 2 * num;

  const doubleNegate = negateUnaryNumericOp(double);
  const ceilNegate = negateUnaryNumericOp(Math.ceil);

  t.is(double(4), 8);

  t.is(doubleNegate(4), -8);
  t.is(ceilNegate(7.5), -7);
});
