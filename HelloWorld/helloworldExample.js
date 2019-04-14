const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://127.0.0.1:27017/test", function(err, db) {
  if (err) throw err;
  console.log("connected to the mongoDB !");

  myCollection = db.collection("test_collection");
  myCollection.insert(
    { name: "Hello World", description: "Sample 1" },
    function(err, result) {
      if (err) throw err;

      console.log("entry saved");
    }
  );

  myCollection.update(
    { name: "Hello World" },
    { name: "Hello World", description: "Sample 2" },
    function(err) {
      if (err) throw err;
      console.log("entry updated");
    }
  );

  var cursor = myCollection.find({ name: "Hello World" });
  cursor.each(function(err, doc) {
    if (err) throw err;
    if (doc == null) return;

    console.log("document find:");
    console.log(doc.name, "|", doc.description);
  });

  myCollection.remove({ name: "Hello World" }, function(err, object) {
    if (err) throw err;
    console.log("document deleted");
  });
});
