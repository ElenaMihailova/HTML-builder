const fs=require('fs');
const path=require('path');
let content='';

const stream=fs.createReadStream(
    path.join(__dirname, 'text.txt'),
);

stream.on('data', chunk => content+=chunk);
stream.on('end', () => console.log(content));
stream.on('error', error => console.log('Error', error.message));
