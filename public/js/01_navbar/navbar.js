arr = ["understand", "access", "connect", "about"];
for (let i = 0; i < arr.length; i++) {
  let liOrder = "#navbarSection .navList #" + arr[i] + "Li";
  let popOrder = "#navbarSection #" + arr[i] + "PopUp";

  function mouseOver(a, b) {
    $(a).on("mouseover click", function () {
      $(b).css({ display: "flex" });
    });
  }
  function mouseOut(a, b) {
    $(a).on("mouseout", function () {
      $(b).css({ display: "none" });
    });
  }
  mouseOver(liOrder, popOrder);
  mouseOver(popOrder, popOrder);
  mouseOut(liOrder, popOrder);
  mouseOut(popOrder, popOrder);
}
$("#navbarSection #hamburger svg").on("click", function () {
  $("#navbarSection .phonePopUp").toggleClass("show");
});
