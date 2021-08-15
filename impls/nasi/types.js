class List {
    constructor(ast){
        this.ast = ast;
    }

    toString(){
        return "(" + this.ast.map(e => e.toString()).join(' ') + ")";
    }

    isEmpty(){
        return this.ast.length === 0
    }
}

class Vector {
    constructor(ast){
        this.ast = ast;
    }

    toString(){
        return "[" + this.ast.map(e => e.toString()).join(' ') + "]";
    }

    isEmpty(){
        return this.ast.length === 0
    }
}

class HashMap {
    constructor(ast){
        this.hashmap = new Map()
        for(let i = 0; i < ast.length; i += 2){
            this.hashmap.set(ast[i], ast[i+1]);
        }
    }

    toString(){
        let str = "";
        let seperator = "";
        for(let [key, value] of this.hashmap.entries()){
            str += seperator + key.toString();
            str += " ";
            str += value.toString()
            seperator = " "
        }
        return "{" + str + "}";
    }

    isEmpty(){
        return this.ast.size === 0
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

class Keyword {
    constructor(keyword) {
        this.keyword = keyword;
    }

    toString(){
        return ":" + this.keyword.toString();
    }
}

module.exports = { List, Vector, HashMap, Nil ,Symbol, Str, Keyword }
