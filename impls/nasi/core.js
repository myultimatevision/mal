const { Env } = require("./env");
const { pr_str } = require("./printer");
const { Symbol, Fn, List, Str, Nil, areEqual } = require("./types");

const core = new Env(null);

core.set(new Symbol("pi"), Math.PI);
core.set(new Symbol("+"), (a, b) => a + b);
core.set(new Symbol("-"), (a, b) => a - b);
core.set(new Symbol("*"), (a, b) => a * b);
core.set(new Symbol("/"), (a, b) => a / b);
core.set(new Symbol("="), areEqual);
core.set(new Symbol(">="), (a, b) => a >= b);
core.set(new Symbol("<="), (a, b) => a <= b);
core.set(new Symbol(">"), (a, b) => a > b);
core.set(new Symbol("<"), (a, b) => a < b);
core.set(new Symbol("prn"), (...ast) => {
  console.log(ast.map((e) => pr_str(e, true)).join(" "));
  return new Nil();
});
core.set(new Symbol("list"), (...ast) => new List(ast));
core.set(new Symbol("list?"), (ast) => ast instanceof List);
core.set(new Symbol("empty?"), (ast) => ast.isEmpty());
core.set(new Symbol("count"), (ast) => ast.count());
core.set(new Symbol("pr-str"), (...ast) => {
  return new Str(ast.map((e) => pr_str(e, true)).join(" "));
});
core.set(new Symbol("str"), (...ast) => {
  return new Str(ast.map((e) => pr_str(e, false)).join(""));
});
core.set(new Symbol("println"), (...ast) => {
  console.log(ast.map((e) => pr_str(e, false)).join(" "));
  return new Nil();
});

module.exports = { core };
