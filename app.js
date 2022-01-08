let express = require("express");
let app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
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
app.get("/lessons", function (req, res) {
  res.render("pages/05_lessons.ejs");
});
app.get("/lessons2", function (req, res) {
  res.render("partials/13_lesson.ejs");
});
app.get("/lessons5", function (req, res) {
  res.render("partials/15_lesson.ejs");
});
app.get("/lessons6", function (req, res) {
  res.render("partials/17_lesson.ejs");
});
app.listen("3000", function () {
  console.log("Server is connected");
});
