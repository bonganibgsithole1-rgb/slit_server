let express = require("express");
let app = express();
let path = require("path");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  console.log("123");
  res.render("pages/01_index.ejs");
});
app.get("/board", function (req, res) {
  res.render("pages/02_board.ejs");
});
app.get("/donate", function (req, res) {
  res.render("pages/03_donate.ejs");
});
app.get("/courses", function (req, res) {
  res.render("pages/04_courses.ejs");
});
app.get("/courses/C01L01S01", function (req, res) {
  res.render("pages/05_lessons.ejs");
});
app.get("/courses/:course/:lesson/:slide", function (req, res) {
  // console.log(req.params.lesson);
  // console.log(req.params.slide);
  // console.log(req.params.course);
  let course = req.params.course;
  let lesson = req.params.lesson;
  let slide = req.params.slide;

  res.send("nansi imali yakho 123456789");
});
app.listen("3000", function () {
  console.log("Server is connected");
});
