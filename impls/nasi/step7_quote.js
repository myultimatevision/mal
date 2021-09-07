const readline = require('readline');
const { read_ast } = require('./reader');
const { pr_str } = require('./printer');
const { List, Vector, HashMap, Symbol, Fn, Nil, Str }= require('./types');
const { Env } = require('./env');
const { core } = require('./core');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const quasiquote = (ast) => {
    if(!(ast instanceof List || ast instanceof Vector)){
        if(ast instanceof Symbol || ast instanceof HashMap){
            return new List([new Symbol('quote'), ast]);
        }
        return ast;
    }

    if(ast instanceof List && ast.beginsWith('unquote')){
        return ast.ast[1];
    }
    
    let list = new List([]);
    for(let i = ast.count() - 1; i >= 0; i--){
        let elt = ast.ast[i];
        if(elt instanceof List && elt.beginsWith("splice-unquote")){
            list = new List([new Symbol("concat"), elt.ast[1], list])
        } else {
            list = new List([new Symbol("cons"), quasiquote(elt), list])
        }
    }
    return (ast instanceof List) ?  list : new List([new Symbol("vec"), list]);
}

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
            const newFn = (...values) => eval(fnBody, Env.create(env, args, values));
            return new Fn(args, fnBody, env , newFn);
        case 'do':
            ast.ast.slice(1).forEach(element => eval(element, env));
            ast = ast.ast[ast.ast.length - 1]
            break;
        case 'if':
            const valueOfCondition = eval(ast.ast[1], env) ;
            ast = (valueOfCondition === false || valueOfCondition instanceof Nil) ? ast.ast[3] : ast.ast[2];   
            break;
        case 'quote': return ast.ast[1];    
        case 'quasiquoteexpand': return quasiquote(ast.ast[1]);    
        case 'quasiquote':
            ast = quasiquote(ast.ast[1]);
            continue; 
        default : 
            const seq = eval_ast(ast, env);
            const fn = seq.ast[0];
            const fnArgs = seq.ast.slice(1);
            if(fn instanceof Fn){
                ast = fn.ast;
                env = Env.create(fn.env, fn.binds, fnArgs);
                continue;
            }
            if(!(fn instanceof Function)){
                throw `${fn.toString()} is not a function`;
            }
            return fn.apply(null, fnArgs);
    }
}
    
}
const env = new Env(core);
env.set(new Symbol('eval'),(ast)=>eval(ast, env));
env.set(new Symbol('*ARGV*'), new List(process.argv.slice(3).map(e=>new Str(e))));


const print = (ast)=>pr_str(ast, true);

const repl = (str, env)=>print(eval(read(str),env));

repl("(def! not (fn* (a) (if a false true)))", env);
repl('(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))', env);


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

loop();
