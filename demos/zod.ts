import { z } from "zod";
import { validated } from "src";

function add(a: any, b: any) {
  return a + b;
}

const validatedAdd = validated([z.number(), z.number()], z.number())(add);
const validatedConcatenate = validated(
  [z.string(), z.string()],
  z.string(),
)(add);

function demo() {
  const numA = 5;
  const numB = 6;

  console.log(`The sum of ${numA} and ${numB} is: `, validatedAdd(numA, numB));

  const strA = "John";
  const strB = "Doe";

  console.log(
    `The concatenation of ${strA} and ${strB} is: `,
    validatedConcatenate(strA, strB),
  );
}

demo();
