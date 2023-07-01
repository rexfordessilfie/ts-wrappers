import wrapper from "../src";

export function debounce(wait = 300) {
  let timeout: any;

  return wrapper((next, ..._args: any[]) => {
    return new Promise<ReturnType<typeof next>>((resolve, reject) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          // @ts-ignore
          resolve(await next());
        } catch (e) {
          reject(e);
        }
      }, wait);
    });
  });
}

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export async function demo() {
  const debouncedLog = debounce(500)(console.log);

  // BEGIN
  debouncedLog("Hey there!");

  await sleep(10);

  debouncedLog("Interupting!");

  await sleep(501); // Wait for long enough to log interrupt

  debouncedLog("Anyone there!");

  await sleep(200); // Wait but for not long enough.

  debouncedLog("Sike! Interrupted again");
}

// Debounce with access to the return value
export async function demo2() {
  const id = <T>(x: T) => {
    return x;
  };

  const data = [
    {
      message: "Hey there!",
      sleep: 0,
    },
    {
      message: "Interruptting!",
      sleep: 501,
    },

    {
      message: "Anyone there?",
      sleep: 200,
    },
    {
      message: "Sike! Interrupted again",
      sleep: 10,
    },
  ];

  const debouncedId = debounce(500)(id);

  for (const item of data) {
    debouncedId(item).then((x) => {
      console.log("X!", x);
    });
    await sleep(item.sleep);
  }
}

demo2();
