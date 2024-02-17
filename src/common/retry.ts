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

type RetryDelay = number | ((attempt: number) => number);

/**
 * Retries a function with the given delay.
 *
 * Suppresses errors that occur and throws a suppressed error at the end or
 * returns the result when it succeeds.
 * */
export const retry = (times: number, delay: RetryDelay = 0) => {
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

          await sleep(typeof delay === "function" ? delay(attempt - 1) : delay);
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

export const delayStrategy = {
  /** Source: https://cloud.google.com/memorystore/docs/redis/exponential-backoff */
  exponential:
    (base = 2, maxBackoff = 32 * 1000, maxNoise = 1000) =>
    (n: number) =>
      Math.min(base ** n * 1000 + Math.random() * maxNoise, maxBackoff),
  linear:
    (gradient = 1, intercept = 0) =>
    (n: number) =>
      gradient * n * 1000 + intercept,
};
