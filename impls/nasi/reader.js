const tokenize = (str)=>{
  const regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
    const tokens = [];
    while((match = regexp.exec(str)[1]) !== ''){
      if(match[0] === ';')
          continue;
      tokens.push(match);
    }
  return tokens
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

const read_symbol = (token)=>{
    const symbols = {
        '+': 'plus',
        '-': 'minus',
        '*': 'asterik',
        '/': 'by',
        '%': 'modulous',
    }
    return symbols[token[0]]
}

const read_atom = (token)=>{
    if(token.match(/^-?[0-9]+$/)){
        return parseInt(token);
    }
    if(token.match(/^-?[0-9]+\.[0-9]+$/)){
        return parseFloat(token);
    }
    return token;
}


const read_list = (reader)=>{
    const ast = []
    let token;
    while((token = reader.peek()) !== ')'){
        if(!token){
            throw 'unbalanced'
        }
        ast.push(read_form(reader))
    }
    reader.next()
    return ast
}

const read_form = (reader)=>{
    const token = reader.peek()
    switch(token[0]){
        case '(' :
            reader.next()
            return read_list(reader)
    }
    reader.next()
    return read_atom(token);
}

const read_ast = (str)=>{
    const tokens = tokenize(str);
    const reader = new Reader(tokens);
    return read_form(reader);
}

module.exports = { read_ast };
