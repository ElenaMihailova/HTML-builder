const fs=require('fs');
const readline=require('readline');
const rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})
let first=false;

console.log('Write something please.');

rl.on('line', (input) => {
    inputFake=input;
    if (first==false) {
        first=true;
    }
    else {
        inputFake=`\n${input}`
    }
    fs.appendFile("02-write-file/new.txt", inputFake, function (err) {
        if (err) throw err;
    });

    if (input=='exit') {
        console.log('Good luck!');
        process.exit();
    }
})
process.on('beforeExit', function () {
    console.log('Good luck!');
});