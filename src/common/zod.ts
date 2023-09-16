import { z } from "zod";

type ZodTupleArg = [] | [z.Schema, ...z.Schema[]];

export function validated<
  ArgsSchema extends ZodTupleArg,
  ReturnSchema extends z.Schema | undefined = undefined,
>(argSchemas: ArgsSchema, returnSchema?: ReturnSchema) {
  return <
    FArgs extends z.input<z.ZodTuple<ArgsSchema>>,
    FReturn extends ReturnSchema extends z.Schema
      ? z.infer<ReturnSchema>
      : unknown,
    Fn extends (...args: FArgs) => FReturn,
  >(
    fn: Fn,
  ) => {
    if (argSchemas.length > fn.length) {
      console.warn(
        `[validateFn] WARNING: function ${fn.name} has fewer arguments than the number of validators provided. The extra validators will be ignored.`,
      );
    } else if (argSchemas.length < fn.length) {
      console.warn(
        `[validateFn] ERROR: function ${fn.name} has more arguments than the number of validators provided. Extra arguments will not be validated.`,
      );
    }

    function newFn(...args: Parameters<Fn>): FReturn {
      const validateCount = Math.min(argSchemas.length, args.length);

      const validateArgs = args.slice(0, validateCount);
      const validateArgsSchemas = argSchemas.slice(
        0,
        validateCount,
      ) as ZodTupleArg;
      const remainingArgs = args.slice(validateCount);

      const finalArgs = [
        ...z.tuple(validateArgsSchemas).parse(validateArgs), // args to validate
        ...remainingArgs,
      ];

      // @ts-ignore TS2683
      const result = fn.apply(this, finalArgs);
      return returnSchema ? returnSchema.parse(result) : result;
    }

    // Copy properties to new function
    Object.entries(Object.getOwnPropertyDescriptors(fn)).forEach(
      ([prop, descriptor]) => {
        Object.defineProperty(newFn, prop, descriptor);
      },
    );

    return newFn;
  };
}
