export default function wrapper<CArgs extends any[], CReturn>(
  cb: (fn: Fn<FnReturnType, CArgs>, ...args: CArgs) => CReturn
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

declare const brand: unique symbol;

type Brand<T, TBrand extends string> = T & {
  [brand]: TBrand;
};

export type Func<Args extends any[], Return> = (...args: Args) => Return;
type FnReturnBrand = "__fn_return__";
type FnReturnType = Brand<{}, FnReturnBrand>;

type Fn<ReturnType = FnReturnType, ArgsType extends any[] = any[]> = <
  Return = ReturnType,
  Args extends any[] = ArgsType
>(
  ...args: Args
) => Return;
