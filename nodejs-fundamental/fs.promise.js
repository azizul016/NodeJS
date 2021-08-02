const fs = require("fs");
const path = require("path");
const util = require("util");
// const newPath = path.join(__dirname, "files", "sample3.txt");
const newPath1 = path.join(__dirname, "files", "sample1.txt");

// important trips
// synchronously method . always try to avoid it
// fs.readFileSync, fs.writeFileSync, fs.appendFileSync, fs.unlinkSync

const writeFilePromise = util.promisify(fs.writeFile);
const appendFilePromise = util.promisify(fs.appendFile);
const readFilePromise = util.promisify(fs.readFile);

// writeFilePromise(newPath, "Hello World")
//   .then(() => {
//     console.log("Data write successfully");
//     appendFilePromise(newPath, " Good Programmer ")
//       .then(() => {
//         console.log("Update file successfully");
//         readFilePromise(newPath, "utf-8")
//           .then((data) => {
//             console.log("Reading file ......");
//             console.log(data);
//           })
//           .catch((err) => console.log(err));
//       })
//       .catch(() => console.log(err));
//   })
//   .catch((err) => console.log(err));

// best way for promises and more cleaner way

writeFilePromise(newPath1, "Hello I am javascript programmer")
  .then(() => {
    console.log("Data write successfully");
    return appendFilePromise(newPath1, " I also know PHP ");
  })
  .then(() => {
    console.log("Data append successfully");
    return readFilePromise(newPath1, "utf-8");
  })
  .then((data) => {
    console.log("Data reading ....");
    console.log(data);
  })
  .catch((err) => console.log(err));
