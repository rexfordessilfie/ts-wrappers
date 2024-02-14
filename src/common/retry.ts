import { sleep } from "../sleep";
import { Any } from "./types";

/** Implementation of SuppressedError
 *
 * Source: https://github.com/microsoft/TypeScript/blob/db3d54ffbc0a805fbdd5104c5a5137d7ca84420a/src/compiler/factory/emitHelpers.ts#L1458
 * */
class SuppressedError extends Error {
  constructor(error: any, suppressed: any, message: string) {
    super(message);
    this.error = error;
    this.suppressed = suppressed;
  }

  name = "SuppressedError";
  error: any;
  suppressed: any;
}

export class RetryError extends SuppressedError {
  name = "RetryError";
}

/**
 * Retries a function with the given delay.
 *
 * Suppresses errors that occur and throws a suppressed error at the end or
 * returns the result when it succeeds.
 * */
export const retry = (times: number, delay = 0) => {
  return function <Fn extends Any.AsyncFunction>(fn: Fn) {
    async function newFn(this: any, ...args: Parameters<Fn>) {
      const ctx: { error?: any; hasError: boolean } = {
        error: undefined,
        hasError: false,
      };

      for (let attempt = 1; attempt <= times; attempt++) {
        try {
          const result = await fn.apply(this, args);
          return result;
        } catch (e) {
          ctx.error = ctx.hasError
            ? new RetryError(
                e,
                ctx.error,
                `An error was suppressed during retry attempt ${attempt}`
              )
            : e;

          ctx.hasError = true;

          if (attempt >= times) {
            throw ctx.error;
          }

          await sleep(delay);
        }
      }
    }

    // Copy properties to new function
    Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
      ([prop, descriptor]) => {
        Object.defineProperty(newFn, prop, descriptor);
      }
    );

    return newFn as Fn;
  };
};
