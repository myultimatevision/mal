const readline = require('readline');
const { read_ast } = require('./reader');
const { pr_str } = require('./printer');
const { List, Vector, HashMap, Symbol }= require('./types');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const eval_ast = (ast, env)=> {
    if(ast instanceof Symbol){
        const fn = env[ast.symbol];
        if(fn === undefined) {
           throw "Symbol not found";
        }
        return fn;
    }
    if(ast instanceof List ){
        const newList = ast.ast.map(element => eval(element, env))
        return new List(newList);
    }
    if (ast instanceof Vector){
        const newVector = ast.ast.map(element => eval(element, env))
        return new Vector(newVector);
    }
    if(ast instanceof HashMap){
        const newList = [];
        for(let [key, value] of ast.hashmap.entries()){
            newList.push(key);
            newList.push(value);
        }
        return new HashMap(newList.map(e => eval(e, env)));
    }
    return ast;
};

const read = (str)=>read_ast(str);
const eval = (ast, env)=>{
    if(!(ast instanceof List)){
        return eval_ast(ast, env);
    }

    if(ast.isEmpty()){
        return ast;
    }
    const seq = eval_ast(ast, env);
    const fn = seq.ast[0];
    return fn.apply(null, seq.ast.slice(1))
}
const print = (ast)=>pr_str(ast);

const repl = (str, env)=>print(eval(read(str),env));

const env = {
    '+' : (a, b) => a + b,
    '-' : (a, b) => a - b,
    '*' : (a, b) => a * b,
    '/' : (a, b) => a / b,
    'pi'  : Math.PI
};

const loop = ()=>{
    rl.question('user> ', (input) => {
        try{
            console.log(repl(input, env));
        } catch (e){
            console.log(e);
        } finally {
            loop();
        }
    });
}

loop()

