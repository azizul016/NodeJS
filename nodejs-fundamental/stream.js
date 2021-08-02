const fs = require("fs");
const path = require("path");

const newPath = path.join(__dirname, "files", "sample3.txt");
const newPath1 = path.join(__dirname, "files", "sample4.txt");

const rsStream = fs.createReadStream(newPath);
const rsStream1 = fs.createReadStream(newPath1);

//"data" is a common keywork
rsStream1.on("data", (chunk) => {
  console.log(chunk.toString());
});

rsStream1.on("end", () => console.log("Data Successfully"));

//Huge Data get chunk by chunk
// let text = "";

// rsStream.on("data", (chunk) => {
//   text += chunk.toString();
// });

// rsStream.on("end", () => {
//   console.log(text);
//   console.log("Data successfully");
// });
