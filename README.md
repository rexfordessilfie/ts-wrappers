# ts-wrappers

Transparent, Type-safe wrappers for your Typescript functions.

## Installation

Install `ts-wrappers` to use the `wrapper` helper or copy and paste the utility wrappers to your project!

```bash
npm install ts-wrappers # Using npm
pnpm add ts-wrappers # Using pnpm
yarn add ts-wrappers # Using yarn
```

## API

| API                                                       | description                                             |
| :-------------------------------------------------------- | :------------------------------------------------------ |
| [`wrapper(cb)`](./src/wrapper.ts)                         | Utility helper for creating type-safe function wrappers |
| [`als(storage, init)(fn)`](./src/common/als.ts)           | Execute a function within an AsyncLocalStorage context  |
| [`debounce(wait, leading)(fn)`](./src/common/debounce.ts) | Debounce a function's invocation                        |
| [`delay(wait)(fn)`](./src/common/delay.ts)                | Delay a function's invocation                           |
| [`intercept(otherFn)(fn)`](./src/common/intercept.ts)     | Intercept a function with another one                   |
| [`memoize(hashFn, cache)(fn)`](./src/common/memoize.ts)   | Memoize a function based on its arguments               |
| [`once(fn)`](./src/common/once.ts)                        | Invoke a function only once in a program lifecycle      |
| [`repeat(count)(fn)`](./src/common/repeat.ts)             | Repeat a function                                       |
| [`throttle(wait)(fn)`](./src/common/throttle.ts)          | Throttle a function's invocation                        |
| [`trace(fn)`](./src/common/trace.ts)                      | Log a function's arguments and duration                 |

You can demo the pre-made common wrappers above by running the following:

```bash
npx tsx <name>.ts
```

> NB: replace `<name>` with the name of the wrapper you would like to demo. e.g als, debounce etc.

## Usage

### Wrappers without arguments

Wrappers such as `trace()` and `once()` can be applied directly to functions without any other arguments.
E.g `trace`

```ts
import { trace } from "ts-wrappers";

function add(a: number, b: number) {
  return a + b;
}

const tracedAdd = trace(add);
//      ^? (a: number, b: number) => number

console.log(tracedAdd(4, 5));
console.log(tracedAdd(3, 5));
```

**OUTPUT**

```txt
add(4,5) | duration: 0.114ms
9
add(10,12) | duration: 0.005ms
22
```

### Wrappers with arguments

Other wrappers such as `retry()`, `debounce()`, `memoize()`, etc. require some external arguments that inform the behavior of the wrapper. These arguments are provided in a "curried" manner.

```ts
import { memoize } from "ts-wrappers";

let fib = function (n: number): number {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
};
// A simple hash function
const hashFn = (x: number) => x;

// Redefining is super important here so it is memoized for recursive calls
fib = memoize(hashFn)(fib);

// Applying trace to the function to see its performance
const tFib = trace(fib);

console.log(tFib(10));
console.log(tFib(10));
```

**OUTPUT**

```txt
 fib(10) | duration: 0.369ms
 55
 -----
 fib(10) | duration: 0.016ms
 55
```

## Templates

You can also define your type-safe wrappers using the basic examples inside of `templates` directory.
You can copy and modify the code to suite your needs.

Heare are the available templates and what they allow you to do.

| template                                                   | Type-safe | Transparent | Arguments? | Scopes |
| :--------------------------------------------------------- | :-------: | :---------: | :--------: | :----: |
| [basic](./templates/basic.ts)                              |    ✅     |     ✅      |     🚫     |   2    |
| [basic (with `wrapper`)](./templates/wrapper/basic.ts)     |    ✅     |     ✅      |     🚫     |   1    |
| [complex](./templates/complex.ts)                          |    ✅     |     ✅      |     ✅     |   3    |
| [complex (with `wrapper`)](./templates/wrapper/complex.ts) |    ✅     |     ✅      |     ✅     |   2    |

**Key**

- **Type-safe**: cannot apply a wrapper to function which does not match its expected args
- **Transparent**: correctly infers the wrapped function type (both arguments and return type) when applied
- **Arguments?**: whether or not the wrapper accepts extra arguments (other than the functions'), e.g `delay` in the `retry()` wrapper
- **Scopes**: how many levels of scope for defining variables. e.g the wrapper scope, wrapped function scope.

## Performance

Manually defining wrappers using the templates has better performance than using the `wrapper` helper. All common wrappers are defined manually for the best performance, however the `wrapper` helper aims to provide an easier approach to dealing with types.

The source-code for the performance evaluation can be found in [demos/benchmark.ts](./demos/benchmark.ts), and can be ran with

```bash
npx tsx demos/benchmark.ts
```

## Acknowledgements

The following repositories were the seeds for, and helpful in building this out!

- [rexfordessilfie/nextwrappers #19](https://github.com/rexfordessilfie/nextwrappers/issues/19)
- [tournament-js/wrappers](https://github.com/tournament-js/wrappers)
