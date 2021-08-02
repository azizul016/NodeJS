const http = require("http");
const path = require("path");
const fs = require("fs");
const util = require("util");

const newPath = path.join(__dirname, "files", "index.html");

const readFilePromise = util.promisify(fs.readFile);

const server = http.createServer((req, res) => {
  //   console.log(req.url, req.method, req.headers);
  //sending response according to response form;
  //   res.write("For a good programmer, don't need a good configuration laptop. ");
  //   res.write("Multiple line can be written..");
  //   res.end();

  //specific path using;
  if (req.url === "/") {
    // res.write("This is node js home page");
    // res.end();

    //index file read
    //synchronously always try to avoid it
    // const content = fs.readFileSync(newPath)
    // res.write(content);
    // res.end()

    //asynchronously method;
    // readFilePromise(newPath)
    //   .then((content) => {
    //     res.write(content);
    //     res.end();
    //   })
    //   .catch((err) => console.log(err));

    //using stream
    //using pipe function end function not needed,
    const readFileStream = fs.createReadStream(newPath);
    readFileStream.pipe(res);
  } else if (req.url === "/admin") {
    res.write("This is admin page. All user is restricted");
    res.end();
  } else if (req.url === "/hello") {
    res.write("Hello Azizul");
    res.end();
  } else {
    res.write("404 Not Found");
    res.end();
  }
});

//listening port
server.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
