let rightArrow = $("#lessonsSection #rightArrow");
let rightMobileArrow = $("#lessonsSection #rightreplacementArrow");

function moveForward(rightArrows) {
  rightArrows.on("click", function () {
    $.ajax({
      method: "GET",
      url: "/courses/C01/L01/S01",
    }).done(function (data) {
      $("#lessonsSection").replaceWith(data);
    });
  });
}
moveForward(rightArrow);
moveForward(rightMobileArrow);
