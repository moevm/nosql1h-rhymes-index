var express = require("express");
const bodyParser = require("body-parser");
const Song = require("./models/song");

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  Song.find({}).then(songs => {
    res.render("index", { songs: songs });
  });
});

app.get("/ok", function(req, res) {
  Song.find({ lastword: "сколько" }).then(songs => {
    res.render("index", { songs: songs });
  });
});

app.get("/create", function(req, res) {
  res.render("create");
});
app.post("/create", function(req, res) {
  const { artist, title, string, lastword } = req.body;
  Song.create({
    artist: artist,
    title: title,
    string: string,
    lastword: lastword
  }).then(song => console.log(song._id));
  res.redirect("/");
});

module.exports = app;
