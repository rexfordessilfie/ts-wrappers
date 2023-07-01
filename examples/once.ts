import wrapper from "../src";

export const once = (() => {
  let executed = false;
  return wrapper((next, ..._: any[]) => {
    if (!executed) {
      executed = true;
      return next();
    }
  });
})();

export function demo() {
  const logOnce = once(console.log);

  logOnce("hello");
  logOnce("hi"); // Does not log
}

demo();
