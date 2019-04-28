var express = require("express");
const bodyParser = require("body-parser");
const Song = require("./models/song");

var app = express();

app.use(express.static("views"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  Song.find({}).then(songs => {
    res.render("index", { songs: songs });
  });
});

app.get("/statistic", function(req, res) {
  res.render("statistic");
});

app.get("/api/statistic", function(req, res) {
  const word = req.query.word;
  const str =
    "(" +
    req.query.word
      .split("")
      .map((s, i) => {
        if (i < word.length - 1) {
          return s + word.slice(-word.length + i + 1);
        }
      })
      .join("|")
      .slice(0, -1) +
    ")";
  // for (i=0; i<str.lenght; i++){
  //   str = str.substring(i)
  Song.find({ lastword: { $regex: str + "$" } }).then(songs => {
    res.send(songs);
  });
});

app.get("/search", function(req, res) {
  // var str  = new RegExp(req.query.word, 'z');
  // var str = '/' + req.query.word + '/';
  const word = req.query.word;
  const str =
    "(" +
    req.query.word
      .split("")
      .map((s, i) => {
        if (i < word.length - 1) {
          return s + word.slice(-word.length + i + 1);
        }
      })
      .join("|")
      .slice(0, -1) +
    ")";
  // for (i=0; i<str.lenght; i++){
  //   str = str.substring(i)
  Song.find({ lastword: { $regex: str + "$" } }).then(songs => {
    res.render("index", { songs });
  });
  // }
});

app.get("/searchsong", function(req, res) {
  const song = req.query.song;
  if (!song) {
    Song.find({}).then(songs => {
      res.render("search", { songs: songs });
    });
  }
  Song.find({
    $or: [
      { artist: { $regex: song, $options: "/i" } },
      { title: { $regex: song, $options: "/i" } }
    ]
  }).then(songs => {
    res.render("search", { songs: songs });
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
