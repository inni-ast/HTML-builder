const path = require('path');
const fs = require('fs');
const prom = require('fs/promises');

const folderFrom = path.resolve(__dirname, 'styles');
const folderTo = path.resolve(__dirname, 'project-dist');
const write = fs.createWriteStream(path.resolve(folderTo, 'bundle.css'));

async function copyStyles() {
  const files = await prom.readdir(folderFrom, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile()) {
      const filePath = path.resolve(folderFrom, file.name);
      if (path.extname(filePath) === '.css') {
        let data = '';
        const stream = fs.createReadStream(filePath);
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => data += '\n');
        stream.on('end', () => write.write(data));
        console.log('Файл успешно скопирован');
      }
    }
  });
}

copyStyles();
