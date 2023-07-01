export default function createWrapper<CArgs extends any[], CReturn>(
  cb: (next: Next, ...args: CArgs) => CReturn
) {
  return <FArgs extends CArgs, FReturn>(func: (...args: FArgs) => FReturn) => {
    return (...args: Parameters<typeof func>) => {
      const next = (() => func(...args)) as Parameters<typeof cb>[0];

      next[FUNC] = func as any;

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
