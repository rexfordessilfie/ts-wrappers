# ts-wrappers

Transparent, Type-safe wrappers for your Typescript functions

## Usage

### Basic

1. Identify the function you want to wrap

   ```ts
   function add(a: number, b: number) {
     return a + b;
   }
   ```

2. Create the `trace()` wrapper

   ```ts
   import wrapper, { FUNC } from "@/";

   const trace = wrapper((next, ...args: any[]) => {
     const tag = `${next[FUNC].name}(${args}) | duration`;
     console.time(tag);
     const result = next();
     console.timeEnd(tag);
     return result;
   });
   ```

3. Apply the wrapper

   ```ts
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

### Complex (wrapper with extra arguments e.g memoization)

For this example, we will create a memoize wrapper for fibonacci numbers. Take this function for example:

1. Identify the function you would like to memoize:

   ```ts
   let fib = function (n: number): number {
     return n < 2 ? n : fib(n - 1) + fib(n - 2);
   };
   ```

2. Create the `memoize()` function which takes a hash function, and an optional cache, and returns a wrapper that memoizes function calls

   ```ts
   import wrapper from "@/";

   export function memoize<
     H extends (...args: any[]) => string | number | symbol
   >(hash: H, cache = Object.create(null)) {
     return wrapper((next, ...args: any[]) => {
       const key = hash(...args);
       if (!(key in cache)) {
         cache[key] = next();
       }
       return cache[key] as ReturnType<typeof next>;
     });
   }
   ```

3. Now, apply the `memoize()` function to `fib`. (_We also apply `trace` from before so we can measure execution times_).

   > NB: Since this function is recursive, we will want to redefine the function so that all recursive calls are memoized.

   ```ts
   // A simple hash function
   const hash = (x: number) => x;

   // Redefining is super important here so it is memoized for recursive calls
   fib = memoize(hash)(fib);

   const tracedFib = trace(fib);

   console.log(tracedFib(10));
   console.log(tracedFib(10));
   ```

   **OUTPUT**

   ```txt
    fib(10) | duration: 0.369ms
    55
    -----
    fib(10) | duration: 0.016ms
    55
   ```
