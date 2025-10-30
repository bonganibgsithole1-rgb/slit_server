let scrollLeftOrRight =
  "#communitySection .subSection .community_sectionLists .galleryExamples .svgScroll svg";
$(document).on("click", scrollLeftOrRight, function () {
  let clickedBtn = $(this);
  let overflowContainer = $(clickedBtn)
    .closest(".galleryExamples")
    .find(".galleryPicsContianer");
  let scrollType = $(clickedBtn).closest(".svgScroll").attr("id");
  if (scrollType === "scrollRight") {
    $(overflowContainer).scrollLeft($(overflowContainer).scrollLeft() + 200);
  } else {
    if (scrollType === "scrollLeft") {
      $(overflowContainer).scrollLeft($(overflowContainer).scrollLeft() - 200);
    }
  }
});
