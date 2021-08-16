const readline = require('readline');
const { read_ast } = require('./reader');
const { pr_str } = require('./printer');
const { List, Vector, HashMap, Symbol }= require('./types');
const { Env } = require('./env');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const eval_ast = (ast, env)=> {
    if(ast instanceof Symbol){
        return env.get(ast);
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
    switch(ast.ast[0].symbol){
        case 'def!':
            return env.set(ast.ast[1], eval(ast.ast[2], env));
        case 'let*':
            const newEnv = new Env(env);
            const bindings = ast.ast[1].ast;
            for(let i=0;i<bindings.length; i+=2){
                newEnv.set(bindings[i], eval(bindings[i+1], newEnv));
            }
            return eval(ast.ast[2], newEnv)   
        default : 
            const seq = eval_ast(ast, env);
            const fn = seq.ast[0];
            return fn.apply(null, seq.ast.slice(1))    
    }
    
}
const env = new Env(null);
env.set(new Symbol('+'), (a, b) => a + b);
env.set(new Symbol('-'), (a, b) => a - b);
env.set(new Symbol('*'), (a, b) => a * b);
env.set(new Symbol('/'), (a, b) => a / b);
// env.set(new Symbol('pi'), Math.PI);

const print = (ast)=>pr_str(ast);

const repl = (str, env)=>print(eval(read(str),env));


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

