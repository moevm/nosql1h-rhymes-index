const dbImport = async function(doc) {
  return new Promise(resolve => {
    collection.insertOne(doc, function(err, res) {
      if (err) throw err;

      songs.push(doc);

      console.log("[DB] 1 document inserted");
      resolve();
    });
  });
};

const dbExport = async function(key) {
  return new Promise(resolve => {
    resolve(songs.find(s => s.key === key) || {});
  });
};

module.exports = { dbImport, dbExport };
