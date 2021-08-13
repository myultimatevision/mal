const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const read = (str)=>str;
const eval = (ast)=>str;
const print = (str)=>str;

const repl = (str)=>print(eval(read(str)))

const loop = ()=>{
    rl.question('user> ', (input) => {
        console.log(repl(input));
        loop()
    });
}

loop()

