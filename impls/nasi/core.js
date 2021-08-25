const fs = require("fs");
const { Env } = require("./env");
const { pr_str } = require("./printer");
const { read_ast } = require("./reader");
const { Symbol, List, Str, Nil, areEqual, Atom } = require("./types");

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
core.set(new Symbol("read-string"), (str) => {
    if(str instanceof Str) return read_ast(str.toString());
    throw 'invalid format';
  });
core.set(new Symbol("slurp"), (fileName) => {
    if(!(fileName instanceof Str)){
       throw 'invalid';
    }
    try {
        return new Str(fs.readFileSync(fileName.toString(undefined, false), 'utf-8'));
    } catch (e) {
        throw 'file not found';
    }
  });

  core.set(new Symbol("atom"), (value) => new Atom(value));
  core.set(new Symbol("atom?"), (atom) => atom instanceof Atom);
  core.set(new Symbol("deref"), (atom) => {
      if(atom instanceof Atom) return atom.deref()
      throw 'invalid type';
    });
    core.set(new Symbol("reset!"), (atom, value) => {
        if(atom instanceof Atom) return atom.reset(value)
        throw 'invalid type';
    });

    core.set(new Symbol("swap!"), (atom, fn, ...args) => {
        if(atom instanceof Atom){
            const evaluatedValue = fn.apply(null, [atom.deref(), ...args]) ;
            return atom.reset(evaluatedValue)
        } 
        throw 'invalid type';
    });
    

module.exports = { core };
