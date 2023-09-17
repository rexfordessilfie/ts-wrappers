import { z } from "zod";

type ZodTupleArg = [] | [z.Schema, ...z.Schema[]];

/**
 * Take as many as possible from Base until empty, discarding items in Source.
 * If Base exhausted, then spread Source.
 */
type TakeUntil<Base extends any[], Source extends any[]> = Base extends [
  infer A,
  ...infer RestBase,
]
  ? Source extends [infer _, ...infer RestSource]
    ? [A, ...TakeUntil<RestBase, RestSource>]
    : []
  : [...Source];

type Test = TakeUntil<[1], [4, 5, 6]>;

export function validated<
  ArgsSchema extends ZodTupleArg,
  ReturnSchema extends z.Schema | undefined = undefined,
>(argSchemas: ArgsSchema, returnSchema?: ReturnSchema) {
  return <
    ArgsIn extends z.input<z.ZodTuple<ArgsSchema>>,
    ArgsOut extends z.infer<z.ZodTuple<ArgsSchema>>,
    Return extends ReturnSchema extends z.Schema
      ? z.infer<ReturnSchema>
      : unknown,
    Fn extends (...args: ArgsOut) => Return,
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

    function newFn(...args: TakeUntil<ArgsIn, ArgsOut>): Return {
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
