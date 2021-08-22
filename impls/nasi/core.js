const { Env } = require("./env");
const { pr_str } = require("./printer");
const { Symbol, Fn, List, Str, Nil, areEqual } = require("./types");

const core = new Env(null);

core.set(new Symbol('pi'), Math.PI);
core.set(new Symbol('+'), new Fn((a, b) => a + b));
core.set(new Symbol('-'), new Fn((a, b) => a - b));
core.set(new Symbol('*'), new Fn((a, b) => a * b));
core.set(new Symbol('/'), new Fn((a, b) => a / b));
core.set(new Symbol('='), new Fn(areEqual));
core.set(new Symbol('>='), new Fn((a, b) => a >= b));
core.set(new Symbol('<='), new Fn((a, b) => a <= b));
core.set(new Symbol('>'), new Fn((a, b) => a > b));
core.set(new Symbol('<'), new Fn((a, b) => a < b));
core.set(new Symbol('prn'), new Fn((...ast) =>{
    console.log(ast.map(e => pr_str(e, true)).join(' '));
    return new Nil();
}));
core.set(new Symbol('list'), new Fn((...ast) => new List(ast)));
core.set(new Symbol('list?'), new Fn((ast) =>ast instanceof List));
core.set(new Symbol('empty?'), new Fn((ast) =>ast.isEmpty()));
core.set(new Symbol('count'), new Fn((ast) =>ast.count()));
core.set(new Symbol('pr-str'), new Fn((...ast) =>{
    return new Str(ast.map(e => pr_str(e, true)).join(' '));
}));
core.set(new Symbol('str'), new Fn((...ast) =>{
    return new Str(ast.map(e => pr_str(e, false)).join(''));
}));
core.set(new Symbol('println'), new Fn((...ast) =>{
    console.log(ast.map(e => pr_str(e, false)).join(' '));
    return new Nil();
}));

module.exports = { core };