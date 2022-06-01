const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;

fs.writeFile(
  filePath,
  '',
  (err) => {
    if (err) throw err;
  }
);

stdout.write('Hello! Write your massage\n');
stdin.on('data', data => {
  let info = data.toString();
  if (info.trim() === 'exit') {
    console.log('Exit from this program. Good luck!');
    process.exit();
  } else {
    fs.appendFile(
      filePath,
      info,
      err => {
        if (err) throw err;
      }
    );
  }

});
process.on('SIGINT', () => {
  console.log('Exit from this program. Good luck!');
  process.exit();
});
