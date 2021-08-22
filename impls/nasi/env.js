const { List, Nil } = require("./types");

class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  set(key, value) {
    this.data[key.symbol] = value;
    return value;
  }

  find(key) {
    if (key in this.data) {
      return this;
    }
    if (!this.outer) {
      return new Nil();
    }
    return this.outer.find(key);
  }

  get(key) {
    const symbol = key.symbol;
    const env = this.find(symbol);
    if (!(env instanceof Env)) {
      throw `${symbol} not found`;
    }
    return env.data[symbol];
  }

  static create(outer, binds = [], exprs = []) {
    const newEnv = new Env(outer);
    for (let i = 0; i < binds.length; i++) {
      if (binds[i].symbol === "&") {
        newEnv.set(binds[i + 1], new List(exprs.slice(i)));
        break;
      }

      if (exprs[i] === undefined) {
        throw "unbalanced";
      }
      newEnv.set(binds[i], exprs[i]);
    }
    return newEnv;
  }
}
module.exports = { Env };
