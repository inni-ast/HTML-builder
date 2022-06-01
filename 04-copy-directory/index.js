const fs = require('fs');
const path = require('path');
const folderFrom = path.join(__dirname, 'files');
const folderTo = path.join(__dirname, 'files-copy');

//create folder
fs.mkdir(folderTo, { recursive: true }, err => {
  if (err) throw err;
  console.log('Папка успешно создана');
});
//read folder and delete files
fs.readdir(folderTo, 'utf8', (err, files) => {
  if (err) throw err;
  if (files.length > 0) {
    files.forEach((file) => {
      fs.unlink(path.join(folderTo, file),
        (err) => {
          if (err) throw err;
        });
    });
  }

});

//читаем содержимое и копируем
function copyDir() {
  fs.readdir(folderFrom, 'utf8', (err, files) => {
    if (err) throw err;
    console.log(files);
    files.forEach((file) => {
      fs.copyFile(path.join(folderFrom, file),
        path.join(folderTo, file), err => {
          if (err) throw err; // не удалось скопировать файл
          console.log('Файл успешно скопирован');
        });
    });
  });
}
copyDir();

