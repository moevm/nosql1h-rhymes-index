var express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Song = require("./models/song");
const upload = require("express-fileupload");

var app = express();

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

app.get("/song", (req, res) => {
  const artist = req.query.a;
  const title = req.query.b;
  Song.find( { artist, title } ).then(songs => {
    res.render("text", { songs: songs.sort((a, b) => {
      return a._id > b._id ? 1 : (a._id < b._id ? -1 : 0);
    })});
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

  Song.insertMany(doc, (err) => {
    if (err) {
      res.status(500).send({err: err.message});
    } else {
      res.sendStatus(200);
    }
  })
});

app.get("/export", (req, res) => {
  Song.find().then((data) => res.send(data));
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
  // for (i = 0; i < str.lenght; i++) {
  //   str = str.substring(i);
  // }
  Song.find({ lastword: { $regex: str + "$" } }).then(songs => {
    res.render("index", { songs: songs.filter((e, i, arr) => arr.findIndex((song) => song.string === e.string) === i) });
  });
  // }
});

app.get("/searchsong", function(req, res) {
  const song = req.query.song;

  if (song) {
    var songarr = song.toString().split("|");
    var art = songarr[0];
    var titl = songarr[1];
    console.log(titl);
    console.log(art);
    console.log(songarr.join(" / "));
  }
  if (!song) {
    Song.find({}).then(songs => {
      res.render("search", { songs: songs });
    });
  }
  if (art && !titl) {
    Song.find({ artist: { $regex: art, $options: "/i" } }).then(songs => {
      res.render("search", { songs: songs });
    });
  }
  if (!art && titl) {
    Song.find({ title: { $regex: titl, $options: "/i" } }).then(songs => {
      res.render("search", { songs: songs });
    });
  }
  Song.find({
    $and: [
      { artist: { $regex: art, $options: "/i" } },
      { title: { $regex: titl, $options: "/i" } }
    ]
  }).then(songs => {
    res.render("search", { songs: songs.filter((e, i, arr) => arr.findIndex((song) => song.author === e.author && song.title === e.title) === i) });
  });
});

app.get("/create", function(req, res) {
  res.render("create");
});
app.post("/create", function(req, res) {
  const { artist, title, string, lastword } = req.body;
  var findlw;
  var strarr = string.split("\r\n");

  strarr.forEach(function(item, i, strarr) {
    findlw = item
      .toLowerCase()
      .split(" ")
      .splice(-1);
    findlw = findlw.toString().replace(",", "");
    findlw = findlw.toString().replace("!", "");
    findlw = findlw.toString().replace("?", "");
    findlw = findlw.toString().replace(" ", "");
    Song.create({
      artist: artist,
      title: title,
      string: item,
      lastword: findlw
    }).then(song => console.log(song._id));
  });
  res.redirect("/");
});

module.exports = app;
