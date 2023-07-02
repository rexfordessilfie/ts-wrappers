export default function wrapper<CArgs extends any[], CReturn>(
  cb: (fn: Fn, ...args: CArgs) => CReturn
) {
  return <FArgs extends CArgs, FReturn>(func: Func<FArgs, FReturn>) => {
    return (...args: Parameters<typeof func>) => {
      return cb(func as Parameters<typeof cb>[0], ...(args as any)) as Replace<
        CReturn,
        FnReturnType,
        ReturnType<typeof func>,
        FnReturnType
      >;
    };
  };
}

declare const brand: unique symbol;

type Brand<T, TBrand extends string> = T & {
  [brand]: TBrand;
};

export type Func<Args extends any[], Return> = (...args: Args) => Return;
type FnReturnBrand = "__FUNC_RETURN__";
type FnReturnType = Brand<{}, FnReturnBrand>;

type ApplyBrand<T, TBrand extends string> = T extends TBrand
  ? T
  : Brand<T, TBrand>;

type Fn<ReturnType = FnReturnType> = <
  T = ReturnType,
  Args extends any[] = any[]
>(
  ...args: Args
) => ApplyBrand<T, FnReturnBrand>;

type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
type LeftIfNotEqual<A, B> = IsEqual<A, B> extends false ? A : never;
type Spreadable<T> = T extends any[] ? T : never;

type Replace<Source, A, B, Sentinel = never> = Source extends Sentinel
  ? Omit<Source, keyof Sentinel> extends infer T
    ? Replace<LeftIfNotEqual<T, {}>, A, B, Sentinel> extends infer U
      ? U | B
      : never // Dummy ternary just so we can get an alias T
    : never // Dummy ternary just so we can get an alias U
  : Source extends Promise<infer T>
  ? Promise<Replace<T, A, B, Sentinel>>
  : Source extends [infer AItem, ...infer ARest]
  ? [
      Replace<AItem, A, B, Sentinel>,
      ...Spreadable<Replace<ARest, A, B, Sentinel>>
    ]
  : Source extends Record<string | number | symbol, any>
  ? { [K in keyof Source]: Replace<Source[K], A, B, Sentinel> }
  : Source extends A
  ? Exclude<Source, A> | B
  : Exclude<Source, A>;
