const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    file = path.join(__dirname, 'secret-folder', file);
    fs.stat(file, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        console.log(`${path.basename(file, path.extname(file))} - ${path.extname(file).slice(1)} - ${stats.size}b`);
      }
    });
  });
});
