const areEqual = (a, b) => {
  if (a instanceof MalValue) {
    return a.equals(b);
  }
  return a === b;
};

class MalValue {
  toString(_, readably) {
    return this.toString(_, readably);
  }

  equals(other) {
    return this === other;
  }
}

class List extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  toString(_, readably) {
    return `(${this.ast.map((e) => e.toString(_, readably)).join(" ")})`;
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
  }

  equals(other) {
    if (!(other instanceof List || other instanceof Vector)) {
      return false;
    }
    const isValuesEqual = this.ast.every((value, index) =>
      areEqual(value, other.ast[index])
    );
    return this.count() === other.count() && isValuesEqual;
  }
}

class Vector extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  toString(_, readably) {
    return `[${this.ast.map((e) => e.toString(_, readably)).join(" ")}]`;
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
  }

  equals(other) {
    if (!(other instanceof List || other instanceof Vector)) {
      return false;
    }
    const isValuesEqual = this.ast.every((value, index) =>
      areEqual(value, other.ast[index])
    );
    return this.count() === other.count() && isValuesEqual;
  }
}

class HashMap extends MalValue {
  constructor(ast) {
    super();
    this.hashmap = new Map();
    for (let i = 0; i < ast.length; i += 2) {
      this.hashmap.set(ast[i], ast[i + 1]);
    }
  }

  toString(_, readably) {
    let str = "";
    let seperator = "";
    for (let [key, value] of this.hashmap.entries()) {
      str += seperator + key.toString(_, readably);
      str += " ";
      str += value.toString(_, readably);
      seperator = " ";
    }
    return `{${str}}`;
  }

  isEmpty() {
    return this.hashmap.size === 0;
  }

  count() {
    return this.hashmap.size;
  }

  equals(other) {
    if (!(other instanceof HashMap)) {
      return false;
    }
    const isValuesEqual = this.count() === other.count();
    for (let [key, value] of this.hashmap.entries()) {
      if (!isValuesEqual) {
        return false;
      }
      const otherValue = other.hashmap.get(key);
      isValuesEqual = areEqual(value, otherValue);
    }
    return isValuesEqual;
  }
}

class Nil extends MalValue {
  constructor() {
    super();
  }

  toString() {
    return "nil";
  }

  count() {
    return 0;
  }

  equals(other) {
    return other instanceof Nil;
  }
}

class Symbol extends MalValue {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }

  toString(_, readably) {
    return this.symbol.toString(_, readably);
  }

  equals(other) {
    return other instanceof Symbol && this.symbol === other.symbol;
  }
}

class Str extends MalValue {
  constructor(str) {
    super();
    this.str = str;
  }

  toString(_, readably) {
    if (!readably) {
      return this.str.toString(_, readably);
    }
    return `"${this.str
      .toString(_, readably)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .toString()}"`;
  }

  equals(other) {
    return other instanceof Str && this.str === other.str;
  }
}

class Keyword extends MalValue {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }

  toString(_, readably) {
    return `:${this.keyword.toString(_, readably)}`;
  }

  equals(other) {
    return other instanceof Keyword && this.keyword === other.keyword;
  }
}

class Fn extends MalValue {
  constructor(binds, ast, env) {
    super();
    this.binds = binds;
    this.ast = ast;
    this.env = env;
  }

  toString() {
    return "#<function>";
  }
}

module.exports = {
  List,
  Vector,
  HashMap,
  Nil,
  Symbol,
  Str,
  Keyword,
  Fn,
  areEqual,
};
