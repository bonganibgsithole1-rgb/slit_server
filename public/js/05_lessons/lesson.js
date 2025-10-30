let slidingArrows = "#lessonsSection .slidingBtnsArrows";
let slidingArrows_mob = "#lessonsSection .mobileNavigation .slidingBtnsArrows";

function slideLorR(a) {
  $(document).on("click", a, function () {
    let clickedBtn = $(this);
    let clickedBtn_id = $(clickedBtn).attr("id");
    let leftOrRight = $(clickedBtn).find("svg").attr("id");
    let binary_direct = leftOrRight === "rightArrow" ? 1 : -1;
    let slide_id = $("#lessonsSection .subSection_Slides").attr("id");
    let lesson_id = $(".subSectionCourseLists").attr("id");
    let course_id = $(".course_id").attr("id");
    let is_employees = $(".is_employees").length > 0;
    $.ajax({
      method: "POST",
      url: `/sliding_arrows/lesson/${lesson_id}/slide/${slide_id}/${binary_direct}`,
      success: function (body) {
        if (body.err_status === 401) {
          alert(body.err_message);
        } else {
          if (body.err_status === 200) {
            $("#lessonsSection").html(body.htmlFile);
            $(".exercisesProgress").html(body.htmlFile2);
            window.history.pushState(
              "title",
              "",
              `${
                is_employees ? "/employees" : ""
              }/courses/${course_id}/lesson/${lesson_id}/slide/${
                body.curr_slide_id
              }`
            );
          }
        }
      },
    });
  });
}
slideLorR(slidingArrows);
// slideLorR(slidingArrows_mob);
