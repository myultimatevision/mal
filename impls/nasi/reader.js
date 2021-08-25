const { List, Vector, HashMap, Nil, Symbol, Str, Keyword }= require('./types');

const tokenize = (str)=>{
  const regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
    const tokens = [];
    while((match = regexp.exec(str)[1]) !== ''){
      if(match[0] === ';'){
          continue;
      }
      tokens.push(match);
    }
  return tokens;
}

class Reader{
    constructor(tokens) {
        this.tokens = tokens.slice();
        this.position=0;
    }
    peek(){
        return this.tokens[this.position];
    }
    next(){
        const currentToken = this.peek();
        if(currentToken)
            this.position++;
        return currentToken;
    }
}

const read_atom = (token)=>{
    if(token.match(/^-?[0-9]+$/)){
        return parseInt(token);
    }
    if(token.match(/^-?[0-9]+\.[0-9]+$/)){
        return parseFloat(token);
    }
    if(token === "true"){
        return true;
    }
    if(token === "false"){
        return false;
    }
    if(token === "nil"){
        return new Nil();
    }
    if(token.match(/^"(?:\\.|[^\\"])*"$/)){
        const str = token.slice(1, -1).replace(/\\(.)/g,(_, c) => c === "n" ? "\n" : c);
        return new Str(str);
    }
    if(token.startsWith('"')){
        return "unbalanced"
    }
    if(token.startsWith(':')){
        return new Keyword(token.slice(1))
    }
    return new Symbol(token);
}

const read_seq = (reader, closing)=>{
    const ast = [];
    let token;
    while((token = reader.peek()) !== closing){
        if(!token){
            throw 'unbalanced';
        }
        ast.push(read_form(reader));
    }
    reader.next();
    return ast;
}

const read_list = (reader)=>{
    const list = read_seq(reader,')');
    return new List(list);
}

const read_vector = (reader)=>{
    const vector = read_seq(reader,']');
    return new Vector(vector);
}

const read_hashmap = (reader)=>{
    const hashMap = read_seq(reader,'}');
    if(hashMap.length % 2 !== 0){
        throw 'odd number of entries in map';
    }
    return new HashMap(hashMap);
}

const prependSymbol = (reader, newSymbol) =>{
    const token = reader.peek(); 
    const symbol = new Symbol(newSymbol);
    const value = read_atom(token);
    return new List([symbol, value])

}

const read_deref = (reader) =>{
    return prependSymbol(reader, 'deref')
}

const read_form = (reader)=>{
    const token = reader.peek();
    switch(token[0]){
        case '(' :
            reader.next();
            return read_list(reader);
        case '[' :
            reader.next();
            return read_vector(reader);
        case '{' :
            reader.next();
            return read_hashmap(reader);
            case '@' :
                reader.next();
                return read_deref(reader);    
        case ')'|']'| '}' :
            throw "unexpected";
    }
    reader.next();
    return read_atom(token);
}

const read_ast = (str)=>{
    const tokens = tokenize(str);
    const reader = new Reader(tokens);
    return read_form(reader);
}

module.exports = { read_ast };
