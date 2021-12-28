let express = require("express");
let app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/01_index.ejs");
});

app.listen("3050", function () {
  console.log("Server is connected");
});
