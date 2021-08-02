const fs = require("fs");
const path = require("path");
const util = require("util");

// important trips
// synchronously method . always try to avoid it
// fs.readFileSync, fs.writeFileSync, fs.appendFileSync, fs.unlinkSync

const newPath = path.join(__dirname, "files", "sample2.txt");

const writeFilePromise = util.promisify(fs.writeFile);
const appendFilePromise = util.promisify(fs.appendFile);
const readFilePromise = util.promisify(fs.readFile);

(async function getContents() {
  try {
    await writeFilePromise(newPath, "Hello Programmers");
    console.log("Write file successfully");
    await appendFilePromise(newPath, " Welcome to programming life ");
    console.log("append file successfully");
    const data = await readFilePromise(newPath);
    console.log("Read file successfully");
    console.log(data.toString());
  } catch (err) {
    console.log(err);
  }
})();
