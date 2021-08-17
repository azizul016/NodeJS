const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "ideas-app";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function dbOps() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Client Connected successfully");

    //db reference;
    const db = client.db(dbName);
    const ideaCollection = db.collection("ideas");

    // add data in database

    const result = await ideaCollection.insertOne({
      title: "web developer",
      description: "this is web developer",
      like: 31,
    });
    console.log(result.ops);

    //close server;
    client.close();
  } catch (error) {
    console.log(error);
  }

  // the following code examples can be pasted here...
}
dbOps();
