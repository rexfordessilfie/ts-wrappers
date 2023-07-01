import wrapper from "../src";

export function debounceLeading(wait = 300) {
  let timeout: any;

  return wrapper((next, ..._args: any[]) => {
    if (!timeout) {
      next();
    }

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
  });
}

export async function demo() {
  const debouncedLog = debounceLeading(500)(console.log);

  async function sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  // BEGIN
  debouncedLog("Hey there!");

  await sleep(10);

  debouncedLog("Interupting!");

  await sleep(501);

  debouncedLog("Anyone there!");

  await sleep(200);

  debouncedLog("Sike! Interrupted again");
}

demo();
