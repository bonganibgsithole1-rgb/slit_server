let displayNav = $("#introductionSection .displayNav");
let belowInfo = $("#introductionSection #explanation .belowNav");

displayNav.on("click", function () {
  belowInfo.toggleClass("show");
});
