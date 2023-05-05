const fs=require("fs");
const fsProm=require("fs/promises");
const path=require("path");

const stylesFolderName=path.join(__dirname, "styles");
const pathToHtmlSource=path.join(__dirname, "template.html");
const assetsFolderName=path.join(__dirname, "assets");
const componentsFolderName=path.join(__dirname, "components");
const pathToCssBundle=path.join(__dirname, "project-dist", "style.css");
const projectDistAssetsFolderName=path.join(__dirname, "project-dist", "assets");
const pathToHtmlBundle=path.join(__dirname, "project-dist", "index.html");
const outputDir="project-dist";

let objTemplatePoints={};
let htmlFile="";

async function buildFolder() {
  let outputDirPath=path.resolve(__dirname, outputDir);
  await fs.promises.rm(outputDirPath, {recursive: true, force: true});
  await fs.promises.mkdir(outputDirPath, {recursive: true});
}

async function buildHtml() {
  const files=await fsProm.readdir(componentsFolderName);

  const readable=fs.createReadStream(pathToHtmlSource, "utf8");
  readable.on("data", (chunk) => {
    htmlFile=chunk.toString();
  });

  files.forEach(async (file) => {
    const filePath=path.join(componentsFolderName, file);
    const stat=await fsProm.stat(filePath);
    if (!stat.isDirectory()) {
      const ext=path.extname(file);
      if (ext===".html") {
        let templatePart=path.basename(file, ext);

        fs.readFile(filePath, "utf-8", (err, content) => {
          if (err) {
            throw err;
          }

          objTemplatePoints[templatePart]=content;

          if (htmlFile.includes(templatePart)) {

            let readable=fs.createReadStream(pathToHtmlSource, "utf8");

            readable.on("data", (chunk) => {
              htmlFile=htmlFile.replace(
                `{{${templatePart}}}`,
                objTemplatePoints[templatePart]
              );
            });
            readable.on("end", async () => {
              await fsProm.writeFile(pathToHtmlBundle, htmlFile, "utf8");
            });
          }
        });
      }
    }
  });
}

function buildCss() {
  fsProm.writeFile(pathToCssBundle, "", (err) => {
    if (err) {
      throw err;
    }
  });

  async function reading() {
    const files=await fsProm.readdir(stylesFolderName);

    files.forEach(async (file) => {
      const filePath=path.join(__dirname, "styles", file);
      const stat=await fsProm.stat(filePath);

      if (!stat.isDirectory()) {
        const ext=path.extname(file);

        if (ext===".css") {
          fs.readFile(filePath, "utf-8", (err, content) => {
            if (err) {
              throw err;
            }

            fs.appendFile(pathToCssBundle, content, (err) => {
              if (err) {
                throw err;
              }
            });
          });
        }
      }
    });
  }
  reading();
}

async function buildAssets(pathBundle, pathSource) {
  await fsProm.mkdir(pathBundle, {recursive: true});
  const files=await fsProm.readdir(pathSource);

  files.forEach(async (file) => {
    const baseFile=path.join(pathSource, file);
    const newFile=path.join(pathBundle, file);
    const stat=await fsProm.stat(baseFile);
    if (stat.isDirectory()) {
      buildAssets(newFile, baseFile);
    } else {
      await fsProm.copyFile(baseFile, newFile);
    }
  });
}

async function buildPage() {
  await buildFolder();
  buildHtml();
  buildCss();
  buildAssets(projectDistAssetsFolderName, assetsFolderName);
}

buildPage();