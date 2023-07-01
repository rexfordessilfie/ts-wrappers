import wrapper from "../src";

export function delay(wait: number) {
  return wrapper((next, ..._: any[]) => {
    return new Promise<ReturnType<typeof next>>((resolve) => {
      setTimeout(() => {
        resolve(next());
      }, wait);
    });
  });
}

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
