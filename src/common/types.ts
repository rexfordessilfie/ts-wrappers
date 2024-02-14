export type { Any };

declare namespace Any {
  type Function<I extends Array<unknown> = Array<any>, O = any> = {
    (...args: I): O;
  };
  type Array<T = unknown> = ReadonlyArray<T>;
}

