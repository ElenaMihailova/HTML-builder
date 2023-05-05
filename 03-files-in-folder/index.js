const fs=require('fs');
const dir=__dirname+'/secret-folder/';
const path=require('path');

fs.open('./03-files-in-folder/secret-folder', 'r', (err, fd) => {
  console.log(fd);
});

fs.readdir(dir, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }

  for (let i=0;i<files.length;i++) {
    const file=`${files[i].name}`;
    let size;
    fs.stat(`./03-files-in-folder/secret-folder/${file}`, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      size=stats.size;
      const name=file.split('.').slice(0, -1).join('.');
      const resolution=path.extname(file);
      console.log(`${name} - ${resolution.split('.').join('')} - ${size/1024} kb`);
    });
  }
});