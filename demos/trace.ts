import { trace } from "../src";

function add(a: number, b: number) {
  return a + b;
}

export function demo() {
  const tracedAdd = trace(add);

  console.log(tracedAdd(4, 5));
  console.log(tracedAdd(3, 5));
}

demo();
