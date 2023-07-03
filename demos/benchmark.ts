import wrapper from "../src/wrapper";

/**
 * Time the execution of a function, check for an expected value and return its duration
 */
function time<F extends (...args: any[]) => any>(
  func: F,
  arr: number[],
  expected?: number
) {
  const t0 = performance.now();
  const result = func();
  const t1 = performance.now();
  const duration = t1 - t0;
  arr.push(duration);

  if (expected !== undefined) {
    if (result !== expected) {
      console.error(
        `Error evaluating function. Expected ${expected}, Received: ${result}`
      );
      throw new Error("Bad result!");
    }
  }

  return duration;
}

/**
 * Compute the average of numbers
 */
const avg = (arr: number[]) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

/**
 * Compute the relative percentage difference between two numbers
 */
const rpd = (a: number, b: number) => {
  return ((b - a) / a) * 100;
};

/**
 * Compute the relative multiplier between two numbers
 */
const mult = (a: number, b: number) => {
  return b / a;
};

/**
 * Convert a number to fixed number of digits
 */
const toFixed = (num: number, digits: number) => {
  return Number(num.toFixed(digits));
};

/**
 * Execute a function for number of iterations and return its average execution time
 */
const runForIterations = async (
  iterations: number,
  fn: Function,
  args: any[],
  expected?: any
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const arr: number[] = [];
      for (let i = 0; i < iterations; i++) {
        time(() => fn(...args), arr, expected);
      }
      resolve(avg(arr));
    } catch (e) {
      reject(e);
    }
  });
};

const run = async (
  exec: Function,
  execMan: Function,
  execTs: Function,
  args: any[]
) => {
  const WARMUP_ITERATIONS = 1_000_000;
  const ITERATIONS = 1_000_000;

  let baselineDur = NaN,
    manualDur = NaN,
    tsWrapperDur = NaN;

  let baselineRpd = NaN,
    tsWrapperRpd = NaN,
    manualRpd = NaN;

  let baselineMult = NaN,
    tsWrapperMult = NaN,
    manualMult = NaN;

  const expected = exec(...args);

  await Promise.all([
    runForIterations(WARMUP_ITERATIONS, exec, args, expected),
    runForIterations(WARMUP_ITERATIONS, execMan, args, expected),
    runForIterations(WARMUP_ITERATIONS, execTs, args, expected),
  ]);

  [baselineDur, manualDur, tsWrapperDur] = await Promise.all([
    runForIterations(ITERATIONS, exec, args, expected),
    runForIterations(ITERATIONS, execMan, args, expected),
    runForIterations(ITERATIONS, execTs, args, expected),
  ]);

  baselineRpd = rpd(baselineDur, baselineDur);
  tsWrapperRpd = rpd(baselineDur, tsWrapperDur);
  manualRpd = rpd(baselineDur, manualDur);

  baselineMult = mult(baselineDur, baselineDur);
  tsWrapperMult = mult(baselineDur, tsWrapperDur);
  manualMult = mult(baselineDur, manualDur);

  console.table({
    base: { "duration / ms": toFixed(baselineDur, 8) },
    manual: { "duration / ms": toFixed(manualDur, 8) },
    wrapper: { "duration / ms": toFixed(tsWrapperDur, 8) },
  });

  console.table({
    base: { "multiplier / x": toFixed(baselineMult, 8) },
    manual: { "multiplier / x": toFixed(manualMult, 8) },
    wrapper: { "multiplier / x": toFixed(tsWrapperMult, 8) },
  });

  console.table({
    base: { "change in duration / %": toFixed(baselineRpd, 8) },
    manual: { "change in duration / %": toFixed(manualRpd, 8) },
    wrapper: { "change in duration / %": toFixed(tsWrapperRpd, 8) },
  });
};

// Prepare arguments for benchmarking
const tsWrapper = wrapper((fn, ...args: any[]) => {
  return fn(...args);
});

export const manWrapper = <FArgs extends any[], FReturn>(
  fn: (...args: FArgs) => FReturn
) => {
  return function newFn(...args: Parameters<typeof fn>) {
    const result = fn(...args);
    return result;
  };
};

const exec = (x: number) => {
  return x * x;
};

const execWithTsWrapper = tsWrapper(exec);
const execWithMan = manWrapper(exec);

run(exec, execWithMan, execWithTsWrapper, [5]);
