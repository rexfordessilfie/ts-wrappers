import test from "ava";
import wrapper from "../src";

test("has defulat export", (t) => {
  t.truthy(wrapper);
});
