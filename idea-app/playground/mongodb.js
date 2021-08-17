const { MongoClient, ObjectID } = require("mongodb");
// const id = new ObjectID();
// console.dir(id);
// console.log(id.id, id.id.length);
// console.log(id.toString(), id.toString().length);
// console.log(id.getTimestamp())

const uri = "mongodb://localhost:27017";
const dbName = "idea-app";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function dbOps() {
  try {
    await client.connect();
    console.log("Client connect successfully");

    //db reference;
    const db = client.db(dbName);
    const ideaCollection = db.collection("ideas");

    // add data in database

    // const result = await ideaCollection.insertOne({
    //   title: "web developer",
    //   description: "this is web developer",
    //   like: 31,
    // });
    const result = await ideaCollection.insertMany([
      {
        title: "web developer1",
        description: "this is web developer description 1",
        like: 30,
      },
      {
        title: "web developer2",
        description: "this is web developer description 2",
        like: 31,
      },
      {
        title: "web developer3",
        description: "this is web developer description 3",
        like: 44,
      },
      {
        title: "web developer4",
        description: "this is web developer description 4",
        like: 41,
      },
      {
        title: "web developer5",
        description: "this is web developer description 5",
        like: 60,
      },
      {
        title: "web developer6",
        description: "this is web developer description 6",
        like: 81,
      },
    ]);
    console.log(result.ops);

    //get single data from database;
    // const result = await ideaCollection.find({
    //     title: "web developer"
    // },{
    //     projection:{ //for getting description part from an object
    //         description: 1,
    //         _id: 0 //cannot want id
    //     }
    // })
    // .count() //kotogula mill ashe
    // .limit(1) // koita dekte cahi
    // .skip(2) // koita skip korte chai
    // .sort({title: 1}) //assending way te sajano
    // .sort({title: -}) //desending way te sajano
    // .toArray() //array koira pathano
    // console.log(result);

    // $eq	 Matches values that are equal to a specified value.
    // $gt	 Matches values that are greater than a specified value.
    // $gte	 Matches values that are greater than or equal to a specified value.
    // $in	 Matches any of the values specified in an array.
    // $lt 	 Matches values that are less than a specified value.
    // $lte	 Matches values that are less than or equal to a specified value.
    // $ne	 Matches all values that are not equal to a specified value.
    // $nin	 Matches none of the values specified in an array.
    //     $and	Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
    // $not	Inverts the effect of a query expression and returns documents that do not match the query expression.
    // $nor	Joins query clauses with a logical NOR returns all documents that fail to match both clauses.
    // $or	Joins query clauses with a logical OR returns all documents that match the conditions of either clause.

    // link query operator: https://docs.mongodb.com/manual/reference/operator/query/
    // const result = await ideaCollection
    //   .find({
    //     // like: {
    //       // $in: [30]
    //       // $gt: 30
    //       // $gte: 30
    //       // $lt: 30
    //       // $lte: 30
    //       $or: [
    //         {
    //           title: "web developer",
    //         },
    //         {
    //           description: "this is web developer1",
    //         },
    //       ],
    //     // },
    //   })
    //   .toArray();
    // console.log(result);

    //update idea;

    //link for update operator: https://docs.mongodb.com/manual/reference/operator/update/
    //     const result = await ideaCollection.updateOne(
    //       {
    //         title: "web developer1",
    //       },
    //       {
    //         $set: {
    //           description: "this is updated filed",
    //         },
    //       },
    //       {
    //         upsert: true,
    //       }
    //     );
    //   console.log(result);

    // const result = await ideaCollection.findOneAndUpdate(
    //   {
    //     title: "web developer1",
    //   },
    //   {
    //     $set: {
    //       description: "this is updated1 filed",
    //     },
    //   },{
    //       returnOriginal: false
    //   }
    // );
    // console.log(result);

    //delete idea;
    // const result = await ideaCollection.deleteOne({title: 'web developer1'})
    // const result = await ideaCollection.findOneAndDelete({title: 'web developer145'})
    // console.log(result);
    //close connection;
    client.close();
  } catch (error) {
    console.log(error);
  }
}
dbOps();
