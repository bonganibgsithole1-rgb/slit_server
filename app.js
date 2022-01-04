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
app.get("/chapters", function (req, res) {
  res.render("pages/04_course(landing).ejs");
});
app.listen("3090", function () {
  console.log("Server is connected");
});
