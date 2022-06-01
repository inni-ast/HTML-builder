const path = require('path');
const fs = require('fs');
const prom = require('fs/promises');

const folderHTMLFrom = path.resolve(__dirname, 'components');
const folderTo = path.resolve(__dirname, 'project-dist');
const folderStylesFrom = path.resolve(__dirname, 'styles');


fs.access(folderTo, async (err) => {
  if (err) {
    await prom.mkdir(folderTo);
    makePage();
  }
  else {
    await prom.rm(folderTo, { recursive: true });
    await prom.mkdir(folderTo, { recursive: true });
    makePage();
  }
});

function checkHTML(HTML) {
  if (HTML.indexOf('{{') !== -1) {
    const start = HTML.indexOf('{{');
    const end = HTML.indexOf('}}');
    const readStream = fs.createReadStream(path.resolve(folderHTMLFrom, `${HTML.slice(start + 2, end)}.html`), 'utf-8');
    let component = '';
    readStream.on('data', (chunk) => component += chunk);
    readStream.on('end', () => {
      HTML = HTML.replace(HTML.slice(start - 4, end + 2), component);
      checkHTML(HTML);
    });
  } else {
    const writeStream = fs.createWriteStream(path.resolve(folderTo, 'index.html'), 'utf-8');
    writeStream.write(HTML);
  }
}

function makeHTML() {
  let readStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');
  let HTML = '';
  readStream.on('data', (chunk) => HTML += chunk);
  readStream.on('end', () => {
    checkHTML(HTML);
  });
}

function fileCopy(curDir, folderTo, file) {
  fs.copyFile(path.join(curDir, file.name), path.join(folderTo, file.name), err => {
    if (err) throw err;
  });
}

async function copying(curDir, folderTo) {
  try {
    await fs.promises.mkdir(folderTo, { recursive: true });
    let files = await prom.readdir(curDir, { withFileTypes: true });
    for (let el of files) {
      if (el.isFile()) {
        fileCopy(curDir, folderTo, el);
      } else {
        copying(path.join(curDir, el.name), path.join(folderTo, el.name));
      }
    }
  } catch (error) {
    console.log(`Error with copy files ${error}`);
  }

}

async function makeStyles() {
  try {
    const writeStream = fs.createWriteStream(path.resolve(folderTo, 'style.css'));
    const files = await prom.readdir(folderStylesFrom, { withFileTypes: true });
    files.forEach(el => {
      if (el.isFile()) {
        const filePath = path.resolve(folderStylesFrom, el.name);
        if (path.extname(filePath) === '.css') {
          const readStream = fs.createReadStream(filePath);
          readStream.pipe(writeStream, { end: false });
        }
      }
    });
  } catch (error) {
    console.log(`Error in bundleCSS: ${error}`);
  }
}

function makePage() {
  makeHTML();
  copying(path.resolve(__dirname, 'assets'), path.resolve(folderTo, 'assets'));
  makeStyles();
}
