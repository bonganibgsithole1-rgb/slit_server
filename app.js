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
app.get("/navbar", function (req, res) {
  res.render("partials/01_navbar.ejs");
});
app.get("/lessons",function(req,res){
  res.render("pages/05_lessons.ejs")
})
app.listen("3000", function () {
  console.log("Server is connected");
});
