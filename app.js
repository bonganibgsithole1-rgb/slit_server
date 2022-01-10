let express = require("express");
let app = express();
let path = require("path");

// let p = path.join(__dirname, "./public");
// console.log(p);
// app.use(express.static(p));
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
app.get("/courses/C01L01S01", function (req, res) {
  res.render("pages/05_lessons.ejs");
});
app.listen("3000", function () {
  console.log("Server is connected");
});
