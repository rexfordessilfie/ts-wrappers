export default function wrapper<CArgs extends any[], CReturn>(
  cb: (next: Next, ...args: CArgs) => CReturn
) {
  return <FArgs extends CArgs, FReturn>(func: (...args: FArgs) => FReturn) => {
    return (...args: Parameters<typeof func>) => {
      const next = (() => func(...args)) as Parameters<typeof cb>[0];

      next[FUNC] = func as any;

      return cb(next, ...(args as any)) as DeepReplace<
        CReturn,
        NextReturnType,
        ReturnType<typeof func>,
        NextReturnType
      >;
    };
  };
}

export const FUNC = Symbol();

declare const brand: unique symbol;

type Brand<T, TBrand extends string> = T & {
  [brand]: TBrand;
};

type NextBrand = "__FUNC_RETURN__";
type NextReturnType = Brand<{}, NextBrand>;

type ApplyNextBrand<T> = T extends NextReturnType ? T : Brand<T, NextBrand>;

type Next<ReturnType = NextReturnType> = (<
  T = ReturnType
>() => ApplyNextBrand<T>) & {
  [FUNC]: <ReturnType = unknown, Args extends any[] = any[]>(
    ...args: Args
  ) => ApplyNextBrand<ReturnType>;
};

type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
type LeftIfNotEqual<A, B> = IsEqual<A, B> extends false ? A : never;
type Spreadable<T> = T extends any[] ? T : never;

type DeepReplace<Source, A, B, Sentinel = never> = Source extends Sentinel
  ? Omit<Source, keyof Sentinel> extends infer T
    ? DeepReplace<LeftIfNotEqual<T, {}>, A, B, Sentinel> extends infer U
      ? U | B
      : never // Dummy ternary just so we can get an alias T
    : never // Dummy ternary just so we can get an alias U
  : Source extends Promise<infer T>
  ? Promise<DeepReplace<T, A, B, Sentinel>>
  : Source extends [infer AItem, ...infer ARest]
  ? [
      DeepReplace<AItem, A, B, Sentinel>,
      ...Spreadable<DeepReplace<ARest, A, B, Sentinel>>
    ]
  : Source extends Record<string | number | symbol, any>
  ? { [K in keyof Source]: DeepReplace<Source[K], A, B, Sentinel> }
  : Source extends A
  ? Exclude<Source, A> | B
  : Exclude<Source, A>;
