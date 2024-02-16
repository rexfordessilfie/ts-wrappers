import test from "ava";
import { RetryError, retry } from "../src";
import { performance } from "perf_hooks";

test("maintains reference to this", async (t) => {
  const data = {
    val: 0,
    retryedInc: retry(3)(async function (this: any) {
      return ++this.val;
    }),
  };

  await data.retryedInc();

  t.is(data.val, 1);
});

test("tracks retry errors", async (t) => {
  const data = {
    attempt: 0,
    retryedInc: retry(3)(async function (this: any) {
      throw new Error(`attempt:${++this.attempt}`);
    }),
  };

  const err = await t.throwsAsync(data.retryedInc.bind(data), {
    instanceOf: RetryError,
  });

  t.is(err?.message, "An error was suppressed during retry attempt 3");
  t.is(err?.error.message, "attempt:3");

  t.is(
    err?.suppressed.message,
    "An error was suppressed during retry attempt 2"
  );
  t.is(err?.suppressed.error.message, "attempt:2");

  t.is(err?.suppressed.suppressed.message, "attempt:1");
});

test("tracks single retry error", async (t) => {
  const data = {
    attempt: 0,
    retryedInc: retry(1)(async function (this: any) {
      throw new Error(`attempt:${++this.attempt}`);
    }),
  };

  const err = await t.throwsAsync(data.retryedInc.bind(data), {
    instanceOf: Error,
  });

  t.is(err?.message, "attempt:1");
});

test("maintains function properties", async (t) => {
  let val = 0;

  async function incBy(this: any, num: number, _dummyArg?: any) {
    val += num;
    return num;
  }

  const retryIncBy = retry(1)(incBy);

  await retryIncBy(10);

  t.is(val, 10);
  t.is(retryIncBy.name, "incBy");
  t.is(retryIncBy.length, 2);
});

test("executes when no errors", async (t) => {
  let val = 0;

  const retryedInc = retry(3)(async () => {
    return ++val;
  });

  await retryedInc();

  t.is(val, 1);
});

test("retries with delay", async (t) => {
  let currTime: number, prevTime: number;

  const DELAY = 100;
  const RETRY_AMOUNT = 3;

  const retryedInc = retry(
    RETRY_AMOUNT,
    DELAY
  )(async () => {
    [currTime, prevTime] = [performance.now(), currTime];

    if (prevTime) {
      const duration = currTime - prevTime;
      t.assert(Math.round(duration / 10) * 10 >= DELAY);
    }

    throw new Error("Error!");
  });

  await retryedInc().catch(() => {});
});

test("retries and succeeds", async (t) => {
  let val = 0;

  const DELAY = 200;
  const RETRY_AMOUNT = 3;

  let callCount = 0;

  const retryedInc = retry(
    RETRY_AMOUNT,
    DELAY
  )(async () => {
    callCount += 1;

    // Only succeed on final retry
    if (callCount < 3) {
      throw new Error("Error!");
    }

    return ++val;
  });

  await retryedInc();

  t.is(val, 1);
  t.is(callCount, 3);
});

test("retries and fails", async (t) => {
  let val = 0;

  let callCount = 0;

  const RETRY_AMOUNT = 3;

  const retryedInc = retry(RETRY_AMOUNT)(async () => {
    callCount += 1;

    // Only succeed on final retry
    if (callCount < RETRY_AMOUNT + 1) {
      throw new Error("Error!");
    }

    return ++val;
  });

  await t.throwsAsync(async () => retryedInc());

  t.is(val, 0);
  t.is(callCount, 3);
});
