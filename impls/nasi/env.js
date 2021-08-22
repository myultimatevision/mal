const { Nil } = require("./types");

class Env {
    constructor(outer, binds = [], exprs = []){
        this.outer = outer;
        this.data = {};

        for(let i=0;i<binds.length; i++){
            if(binds[i] instanceof Symbol && binds[i].symbol === '&') {
                this.set(binds[i + 1], new List(exprs.slice(i)));
                break;
              }
            this.set(binds[i], eval(exprs[i], this));
        }
    }

    set(key, value){
        this.data[key.symbol] = value;
        return value;
    }

    find(key){
        if(key in this.data){
            return this;
        }
        if(!this.outer){
            return null;
        }
        return this.outer.find(key);
    }
    
    get(key){
        const symbol = key.symbol;
        const env = this.find(symbol);
        if(!(env instanceof Env)){
            throw `${symbol} not found`;
        }
        return env.data[symbol];
    }

}
module.exports = { Env };