const fsProm=require("fs/promises");
const fs=require("fs");
const path=require("path");

const needPath=path.join(__dirname, "styles");
const bundleFile=path.join(__dirname, "project-dist", "bundle.css");

fsProm.writeFile(bundleFile, '', err => {
  if (err) {
    throw err
  }
})

async function merge() {
  const files=await fsProm.readdir(needPath);

  files.forEach(async (file) => {
    const filePath=path.join(__dirname, "styles", file);
    const stat=await fsProm.stat(filePath);
    if (!stat.isDirectory()) {
      const ext=path.extname(file);
      if (ext===".css") {
        fs.readFile(filePath, 'utf-8', (err, content) => {
          if (err) {
            throw err
          }
          fs.appendFile(bundleFile, content, err => {
            if (err) {
              throw err
            }
          })
        })
      }
    }
  });

  console.log('Done!');
}

merge();

