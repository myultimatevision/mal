const { Env } = require("./env");
const { pr_str } = require("./printer");
const { Symbol, Fn, List, Str } = require("./types");

const core = new Env(null);

core.set(new Symbol('pi'), Math.PI);
core.set(new Symbol('+'), new Fn((a, b) => a + b));
core.set(new Symbol('-'), new Fn((a, b) => a - b));
core.set(new Symbol('*'), new Fn((a, b) => a * b));
core.set(new Symbol('/'), new Fn((a, b) => a / b));
core.set(new Symbol('='), new Fn((a, b) => a === b));
core.set(new Symbol('>='), new Fn((a, b) => a >= b));
core.set(new Symbol('<='), new Fn((a, b) => a <= b));
core.set(new Symbol('>'), new Fn((a, b) => a > b));
core.set(new Symbol('<'), new Fn((a, b) => a < b));
core.set(new Symbol('prn'), new Fn((ast) =>{
    console.log(pr_str(ast));
    return new Nil();
}));
core.set(new Symbol('list'), new Fn((ast) => new List(ast)));
core.set(new Symbol('list?'), new Fn((ast) =>ast instanceof List));
core.set(new Symbol('empty?'), new Fn((ast) =>ast.isEmpty()));
core.set(new Symbol('count'), new Fn((ast) =>ast.count()));
core.set(new Symbol('pr-str'), new Fn((ast) =>{
    return new Str(ast.ast.map(e => pr_str(e)).join(" "));
}));
core.set(new Symbol('str'), new Fn((ast) =>{
    return new Str(ast.ast.map(e => pr_str(e)).join(""));
}));
core.set(new Symbol('println'), new Fn((ast) =>{
    console.log(ast.ast.map(e => pr_str(e)).join(" "));
    return new Nil();
}));

module.exports = { core };