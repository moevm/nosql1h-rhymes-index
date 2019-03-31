const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  artist: {
    type: String
  },
  title: {
    type: String,
    require: true
  },
  string: {
    type: String
  },
  lastword: {
    type: String
  }
});

module.exports = mongoose.model("Song", schema);
