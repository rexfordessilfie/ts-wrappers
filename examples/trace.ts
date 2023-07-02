import wrapper, { FUNC } from "../src";

function add(a: number, b: number) {
  return a + b;
}

export const trace = wrapper((next, ...args: any[]) => {
  const tag = `${next[FUNC].name}(${args}) | duration`;
  console.time(tag);
  const result = next();
  console.timeEnd(tag);
  return result;
});

export function demo() {
  const tracedAdd = trace(add);

  console.log(tracedAdd(4, 5));
  console.log(tracedAdd(3, 5));
}
