const readline = require('readline');
const { read_ast } = require('./reader');
const { pr_str } = require('./printer');
const { List, Vector, HashMap, Symbol, Fn, Nil }= require('./types');
const { Env } = require('./env');
const { core } = require('./core');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const eval_ast = (ast, env)=> {
    if(ast === undefined){
        return new Nil();
    }
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
    while(true){
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
            env = newEnv;
            ast = ast.ast[2];
            break;
        case 'fn*':
            const args = ast.ast[1].ast;
            const fnBody = ast.ast[2];
            return new Fn(args, fnBody, env);
        case 'do':
            let evaluatedExpression = new Nil();
            ast.ast.slice(1).forEach(element => {
                evaluatedExpression = eval(element, env)
            });
            ast = ast.ast[ast.ast.length - 1]
            break;
        case 'if':
            const valueOfCondition = eval(ast.ast[1], env) ;
            ast = (valueOfCondition === false || valueOfCondition instanceof Nil) ? ast.ast[3] : ast.ast[2];   
            break;
        default : 
            const seq = eval_ast(ast, env);
            const fn = seq.ast[0];
            const fnArgs = seq.ast.slice(1);
            if(fn instanceof Fn){
                ast = fn.ast;
                env = Env.create(env, fn.binds, fnArgs);
                continue;
            }
            if(!(fn instanceof Function)){
                return seq;
            }
            return fn.apply(null, fnArgs);
    }
}
    
}
const env = new Env(core);

const print = (ast)=>pr_str(ast, true);

const repl = (str, env)=>print(eval(read(str),env));

repl("(def! not (fn* (a) (if a false true)))", env);

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

