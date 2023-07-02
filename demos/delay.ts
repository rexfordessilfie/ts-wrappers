import { delay } from "../src";

export async function demo() {
  function add(a: number, b: number) {
    return a + b;
  }

  const delayedAdd = delay(500)(add);

  console.time("delayedAdd");
  const result = await delayedAdd(10, 20);
  console.timeEnd("delayedAdd");
  console.log("result: ", result);
}

demo();
