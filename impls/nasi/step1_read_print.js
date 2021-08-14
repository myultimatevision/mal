const readline = require('readline');
const { read_ast } =require('./reader')
const { pr_str } =require('./printer')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const read = (str)=>read_ast(str);
const eval = (ast)=>ast;
const print = (ast)=>pr_str(ast);

const repl = (str)=>print(eval(read(str)))

const loop = ()=>{
    rl.question('user> ', (input) => {
        try{
            console.log(repl(input));
        } catch (e){
            console.log(e)
        } finally {
            loop()
        }
    });
}

loop()

