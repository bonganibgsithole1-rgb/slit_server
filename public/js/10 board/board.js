let historyname = $("#boardSection .subSection .level ul li .history");

for (let i = 0; i < historyname.length; i++) {
  let historysetup =
    "#boardSection .subSection .level ul li:nth-of-type(" +
    (i + 1) +
    ") .history";
  let history = $(historysetup);

  let buttonsetup =
    "#boardSection .subSection .level ul li:nth-of-type(" +
    (i + 1) +
    ") button";
  let button = $(buttonsetup);

  button.on("click", function () {
    history.toggleClass("showHistory");
    history.css({ borderBottom: "1px solid lightgray" });
    button.toggleClass("showBorder");
  });
}
