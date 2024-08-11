export default function wrapper<CArgs extends any[], CReturn>(
  cb: (fn: Fn<UnspecifiedReturnType, CArgs>, ...args: CArgs) => CReturn
) {
  return <FArgs extends CArgs, FReturn>(func: Func<FArgs, FReturn>) => {
    return function (...args: Parameters<typeof func>) {
      return cb.call(
        // @ts-ignore TS2683
        this,
        func as Parameters<typeof cb>[0],
        ...(args as CArgs)
      );
    };
  };
}

declare const return_type: unique symbol;

type BrandedReturnType<T, TBrand extends string> = T & {
  [return_type]: TBrand;
};

export type Func<Args extends any[], Return> = (...args: Args) => Return;
type Unspecified = "unspecified";
type UnspecifiedReturnType = BrandedReturnType<{}, Unspecified>;

type Fn<ReturnType = UnspecifiedReturnType, ArgsType extends any[] = any[]> = <
  Return = ReturnType,
  Args extends any[] = ArgsType
>(
  ...args: Args
) => Return;
