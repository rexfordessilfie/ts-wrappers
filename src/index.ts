export default function createWrapper<CArgs extends any[], CReturn>(
  cb: (next: Next, ...args: CArgs) => CReturn
) {
  return <FArgs extends CArgs, FReturn>(func: (...args: FArgs) => FReturn) => {
    return (...args: Parameters<typeof func>) => {
      const next = (() => func(...args)) as Parameters<typeof cb>[0];

      next[FUNC] = func;

      return cb(next, ...(args as any)) as CReturn extends NextReturnType
        ? Replace<CReturn, NextReturnType, ReturnType<typeof func>>
        : Exclude<CReturn, NextReturnType>;
    };
  };
}

export function createWrapperWithIntersectedArgs<CArgs extends any[], CReturn>(
  cb: (next: Next, ...args: CArgs) => CReturn
) {
  return <FArgs extends CArgs, FReturn>(
    func: (
      ...args: FArgs extends unknown[]
        ? TupleMerge<
            Parameters<typeof cb> extends [infer _, ...infer Args]
              ? Args
              : CArgs,
            FArgs
          >
        : FArgs
    ) => FReturn
  ) => {
    return (...args: Parameters<typeof func>) => {
      const next = (() => func(...args)) as Parameters<typeof cb>[0];

      next[FUNC] = func;

      return cb(next, ...(args as any)) as CReturn extends NextReturnType
        ? Replace<CReturn, NextReturnType, ReturnType<typeof func>>
        : Exclude<CReturn, NextReturnType>;
    };
  };
}

type Replace<T, U, V> = Exclude<T, U> | V;

export const FUNC = Symbol();

declare const brand: unique symbol;

type Brand<T, TBrand extends string> = T & {
  [brand]: TBrand;
};

type NextBrand = "__next_return__";
type NextReturnType = Brand<{}, NextBrand>;

type ApplyNextBrand<T> = T extends NextReturnType ? T : Brand<T, NextBrand>;

type Next<ReturnType = NextReturnType> = (<
  T = ReturnType
>() => ApplyNextBrand<T>) & {
  [FUNC]: (...args: any[]) => any;
};

type IsAny<T> = 0 extends 1 & T ? true : false;

type Merge<U, V> = IsAny<V> extends true
  ? U
  : IsAny<U> extends true
  ? V
  : V & U;

type Append<T, U> = U extends any[] ? [...U, T] : [U, T];

type TupleMerge<
  ATuple extends any[],
  BTuple extends any[],
  SoFar extends any[] = []
> = ATuple extends [infer A, ...infer ARest]
  ? BTuple extends [infer B, ...infer BRest]
    ? TupleMerge<ARest, BRest, Append<Merge<A, B>, SoFar>>
    : [...SoFar, ...ATuple]
  : [...SoFar, ...BTuple];
