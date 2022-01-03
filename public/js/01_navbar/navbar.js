let arr = ["learn", "read", "about", "donate"];
for (let i = 0; i < arr.length; i++) {
  let popup = ` #navbarSection #${arr[i]}PopUp`;
  let liAndPopup = `#navbarSection #navBtns #${arr[i]}Li, ${popup}`;
  $(liAndPopup).on("mouseover click", function () {
    $(popup).css({ display: "block" });
  });
  $(liAndPopup).on("mouseout", function () {
    $(popup).css({ display: "none" });
  });
}
$("#navbarSection #hamburger svg").on("click", function () {
  $("#navbarSection .phonePopUp").toggleClass("show");
});
