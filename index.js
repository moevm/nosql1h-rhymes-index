const app = require("./app");
const database = require("./database");
const config = require("./config");

database()
  .then(info => {
    console.log(`Connected to ${info.host}:${info.PORT}/${info.name}`);
    app.listen(config.PORT, function() {
      console.log(`Example app listening on port ${config.PORT}!`);
    });
  })
  .catch(() => {
    console.error("Unable to connect to database");
    //process.exit(1);
  });
