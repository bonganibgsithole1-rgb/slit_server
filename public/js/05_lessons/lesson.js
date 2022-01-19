let rightArrow = $("#lessonsSection #rightArrow");
rightArrow.on("click", function () {
  $.ajax({
    method: "GET",
    url: "/courses/C01/L01/S01",
  }).done(function (data) {
    console.log("i have received feedback");
    console.log("here is the feedback i received :");
    console.log(data);
  });
});
