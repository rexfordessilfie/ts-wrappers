import wrapper from "../src/wrapper";

function time<F extends (...args: any[]) => any>(
  func: F,
  arr: number[],
  expected: number
) {
  const t0 = performance.now();
  const result = func();
  const t1 = performance.now();
  const dur = t1 - t0;
  arr.push(dur);

  if (result !== expected) {
    throw new Error("Bad result!");
  }
  return dur;
}

const avg = (arr: number[]) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

const rpd = (a: number, b: number) => {
  return ((b - a) / a) * 100;
};

const toFixed = (num: number, digits: number) => {
  return Number(num.toFixed(digits));
};

function exec(x: number) {
  return x * x;
}

function exec1(x: number) {
  return x * x;
}

function exec2(x: number) {
  return x * x;
}
const tsWrapped = wrapper((fn, ...args: any[]) => {
  return fn(...args);
});

const manWrapped = <FArgs extends any[], FReturn>(
  func: (...args: FArgs) => FReturn
) => {
  return (...args: Parameters<typeof func>) => func(...args);
};

const execTs = tsWrapped(exec1);
const execMan = manWrapped(exec2);

const arr: number[] = [];
const arrTs: number[] = [];
const arrMan: number[] = [];

const expected = exec(5);

for (let i = 0; i < 1_000_000; i++) {
  time(() => exec(5), arr, expected);
  // time(() => execTs(5), arrTs, expected);
  // time(() => execMan(5), arrMan, expected);
}

const baseline = avg(arr);
const tswrapper = avg(arrTs);
const manual = avg(arrMan);

console.table({
  base: { "duration / ms": toFixed(baseline, 8) },
  wrapper: { "duration / ms": toFixed(tswrapper, 8) },
  manual: { "duration / ms": toFixed(manual, 8) },
});

const baselineRpd = rpd(baseline, baseline);
const tswrappersRpd = rpd(baseline, tswrapper);
const manualRpd = rpd(baseline, manual);

console.table({
  base: { "change in duration / %": toFixed(baselineRpd, 8) },
  wrapper: { "change in duration / %": toFixed(tswrappersRpd, 8) },
  manual: { "change in duration / %": toFixed(manualRpd, 8) },
});
