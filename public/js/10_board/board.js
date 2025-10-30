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

let showOrHideBoardInfo = "#boardSection .subSection ul li .boardBiography h5";
$(document).on("click", showOrHideBoardInfo, function () {
  let clickedBtn = $(this);
  let isOpen = (
    "" + $(clickedBtn).closest(".boardBiography").attr("class")
  ).includes("open");
  console.log(isOpen);
  if (isOpen) {
    $(clickedBtn)
      .closest(".boardBiography")
      .attr("class", "boardBiography closed");
    $(clickedBtn).find(".svgContainer")
      .html(`<svg aria-hidden="true" class="svg-icon topic_dropDown iconArrowDownAlt" width="18" height="18" viewBox="0 0 18 18">
                <path d="m16.01 7.43-1.4-1.41L9 11.6 3.42 6l-1.4 1.42 7 7 7-7Z">
                </path>
              </svg>`);
  } else {
    $(clickedBtn)
      .closest(".boardBiography")
      .attr("class", "boardBiography open");
      $(clickedBtn).find(".svgContainer")
        .html(`<svg aria-hidden="true" class="svg-icon topic_dropDown iconArrowUpAlt" width="18" height="18" viewBox="0 0 18 18">
                <path d="m16.01 10.62-1.4 1.4L9 6.45l-5.59 5.59-1.4-1.41 7-7 7 7Z">
                </path>
              </svg>`);
  }
});

