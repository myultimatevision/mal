class List {
    constructor(ast){
        this.ast = ast;
    }

    toString(){
        return "(" + this.ast.map(e => e.toString()).join(' ') + ")";
    }
}

class Vector {
    constructor(ast){
        this.ast = ast;
    }

    toString(){
        return "[" + this.ast.map(e => e.toString()).join(' ') + "]";
    }
}

class HashMap {
    constructor(ast){
        this.ast = ast;
    }

    toString(){
        return "{" + this.ast.map(e => e.toString()).join(' ') + "}";
    }
}

class Nil {
    toString(){
        return "nil";
    }
}

class Symbol {
    constructor(symbol) {
        this.symbol = symbol;
    }

    toString(){
        return this.symbol.toString();
    }
}

class Str {
   constructor(str) {
       this.str = str;
   }

   toString(){
       return '"' + this.str + '"';
   }
}

module.exports = { List, Vector, HashMap, Nil ,Symbol, Str }
