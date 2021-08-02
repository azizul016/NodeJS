const fs = require("fs");
// console.log(fs);
const path = require("path");

// important trips
// synchronously method . always try to avoid it
// fs.readFileSync, fs.writeFileSync, fs.appendFileSync, fs.unlinkSync

//read data from file;
// fs.readFile("./files/sample.txt", "utf-8", (err, data)=>{
//     if(err) return console.log(err);
//     console.log(data);
// })

//write data from file;
// fs.writeFile("./files/sample.txt", "I am a good programmer", () => {
//   console.log("data write successfully");
// });

//update data from file;
// fs.appendFile('./files/sample.txt', " Hello programmer", (err)=>{
//           if(err) return console.log(err);
//     console.log(data, "data updated successfully");
// })

//delete text file;
// fs.unlink("./files/sample.txt", (err) => {
//   if (err) return console.log(err);
//   console.log("delete text file");
// });

// get the full data with write, update and read

fs.writeFile("./files/sample.txt", "Hello Programmer", () => {
  fs.appendFile("./files/sample.txt", " I am a Programmer", (err) => {
    if (err) return console.log(err);
    fs.readFile("./files/sample.txt", "UTF-8", (err, data) => {
      if (err) return console.log(err);
      console.log(data);
    });
  });
});

//with path module include fs module
// const path = require("path");

//updated path
// const newPath = path.join(__dirname, "files", "sample2.txt");

// fs.writeFile(newPath, "Hello Programmer", () => {
//   fs.appendFile(newPath, " I am a Programmer", (err) => {
//     if (err) return console.log(err);
//     fs.readFile(newPath, "UTF-8", (err, data) => {
//       if (err) return console.log(err);
//       console.log(data);
//     });
//   });
// });

//read how many file in an folder;
// fs.readdir("./dir", (err, files) => {
//   if (err) return console.log(err);
//   console.log(files);
//   console.log(path.join(__dirname, "dir", "fs1.js"));

// });

//write new thing in js file after finding this file
// let jsFilePath = path.join(__dirname, "dir", "fs1.js");
// fs.readdir("./dir", (err, files) => {
//   if (err) return console.log(err);
//   console.log(files);
//   console.log(path.join(__dirname, "dir", "fs1.js"));
//   fs.writeFile(jsFilePath, "New World", (err) => {
//     if (err) return console.log(err);
//     console.log("Write Successfully");
//   });
// });
