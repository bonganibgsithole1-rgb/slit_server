let express = require("express");
let app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/01_index");
});
app.get("/board", function (req, res) {
  res.render("pages/02_board");
});
app.get("/donate", function (req, res) {
  res.render("pages/03_donate");
});
app.get("/courses", function (req, res) {
  res.render("pages/04_courses");
});
app.get("/navbar", function (req, res) {
  res.render("partials/01_navbar");
});
app.get("/lessons",function(req,res){
  res.render("pages/05_lessons")
})
app.listen("3000", function () {
  console.log("Server is connected");
});
