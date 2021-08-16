const { Nil } = require("./types");

class Env {
    constructor(outer, bindings=[], exprs=[]){
        this.outer = outer;
        this.data = {};

        for(let i=0;i<bindings.length; i++){
            this.set(bindings[i], eval(exprs[i], this));
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
            return new Nil();
        }
        return this.outer.find(key);
    }
    
    get(key){
        const symbol = key.symbol;
        const env = this.find(symbol);
        if(!env){
            throw `${symbol} not found`;
        }
        return env.data[symbol];
    }


}
module.exports = { Env };