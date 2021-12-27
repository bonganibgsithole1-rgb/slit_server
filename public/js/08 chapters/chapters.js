let hovedParagraph = $("#chaptersSection .chapterBoxes p");
let underlined = $("#chaptersSection li .chapterBoxes .chaptersHeading");
function mouse(a, b) {
  a.on("mouseover", function () {
    b.css({ textDecoration: "underline" });
  });
  a.on("mouseout", function () {
    b.css({ textDecoration: "none" });
  });
}
mouse(hovedParagraph, underlined);
mouse(underlined, underlined);
