const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

const read = fs.createReadStream(filePath, 'utf-8');
let data = '';
read.on('data', chunk => data += chunk);
read.on('end', () => console.log(data));
read.on('error', error => console.log('Error', error.message));
