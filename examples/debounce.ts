import wrapper from "../src";

export function debounce(wait = 300) {
  let timeout: any;

  return wrapper((next, ..._args: any[]) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      next();
    }, wait);
  });
}

export async function demo() {
  const debouncedLog = debounce(500)(console.log);

  async function sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  // BEGIN
  debouncedLog("Hey there!");

  await sleep(10);

  debouncedLog("Interupting!");

  await sleep(501); // Wait for long enough to log interrupt

  debouncedLog("Anyone there!");

  await sleep(200); // Wait but for not long enough.

  debouncedLog("Sike! Interrupted again");
}

demo();
