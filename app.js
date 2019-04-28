var express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Song = require("./models/song");
const upload = require("express-fileupload");

var app = express();

const { dbImport, dbExport } = require("./dbLibs");
app.use(upload());
app.use(cookieParser());

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

  // Song.find({ lastword: { $regex: str + "$" } }).then(songs => {
  //   res.send(songs);
  // });
  Song.aggregate([
    { $match: { lastword: { $regex: str + "$" } } },
    { $project: { _id: 0, gr_song: "$title" } },
    { $group: { _id: { gr_song: "$gr_song" }, hits: { $sum: 1 } } }
  ]).then(songs => {
    res.send(songs);
  });
});

app.get("/api/statistic777", function(req, res) {
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

  Song.aggregate([
    { $match: { lastword: { $regex: str + "$" } } },
    { $project: { _id: 0, gr_word: "$lastword" } },
    { $group: { _id: { gr_word: "$gr_word" }, whits: { $sum: 1 } } }
  ]).then(songs => {
    res.send(songs);
  });
});

app.post("/import", (req, res) => {
  const file = req.files.json;
  const doc = JSON.parse(file.data.toString("utf-8"));

  dbImport(doc).then(() => {
    res.sendStatus(200);
  });
});

app.get("/export", (req, res) => {
  const reqSession = req.cookies.session;

  if (reqSession && sessions[reqSession]) {
    dbExport(sessions[reqSession]).then(json => {
      res.send(json);
    });
  }
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
