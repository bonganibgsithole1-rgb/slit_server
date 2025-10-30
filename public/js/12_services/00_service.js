let liService = ".serviceListContainer .servicesList li .containerPadder";
$(document).on("mouseover", liService, function () {
  let hoveredItem = $(this);
  $(hoveredItem).closest("li").css({ padding: "0 0 20px 0" });
});
$(document).on("mouseout", liService, function () {
  let hoveredItem = $(this);
  $(hoveredItem).closest("li").css({ padding: "10px 0" });
});
$(document).on("click", liService, function () {
  let clickedBtn = $(this);
  let service_id = $(clickedBtn).attr("id");
  let data = ("" + $(clickedBtn).find(".li_Explanation h5").html()).trim();

  console.log(data);
  $.ajax({
    method: "POST",
    url: "/getService",
    data: { service_name: data },
    success: function (body) {
      console.log(body.data);
      $(".absolutePage .section .subSection").html(`
        <h2 id='${body.data_id}'>${body.data}</h2>
        <div class='services_content_container'>
          <div class='paragraphs_container'>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta optio repellat aliquid rem molestiae dolor in error.Dicta optio repellat aliquid rem molestiae dolor in error? Consequatur similique perspiciatis, repellendus error dolores corporis soluta, suscipit eos sed recusandae veniam.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta optio repellat aliquid rem molestiae dolor in error, consectetur adipisicing elit. Dicta optio repellat aliquid rem molestiae dolor in error? Consequatur similique perspiciatis, repellendus error dolores corporis soluta, suscipit eos sed recusandae veniam.</p>     
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta optio repellat aliquid rem molestiae dolor in error? Consequatur similique perspiciatis, repellendus error dolores corporis soluta, suscipit eos sed recusandae veniam.</p>     
          </div>
          <div class='service_gallery_container'>
            <img src="./Media/SLIT_IMAGES/pov-african-american-specialist-doctor-sitting-desk-hospital-office-explaining-healthcare-treatment-remote-patient-online-videocall-meeting-conference-telehealth-concept.jpg" alt="">
          </div>
        </div>
        `);
    },
  });
  $(".absolutePage").attr("class", "absolutePage");
});

let clickBtnServiceBody = "#editServiceBody";
$(document).on("click", clickBtnServiceBody, function () {
  let clickedBtn = $(this);
  let data_id = $(clickedBtn).closest(".subSection").find("h2").attr("id");
  let data_body = $(clickedBtn).closest(".subSection").find("textarea").val();
  $.ajax({
    method: "POST",
    url: "/serviceBody",
    data: { service_body: data_body, service_id: data_id },
    success: function (body) {
      console.log(body.data);
      $(".absolutePage .section .subSection").html(`
        <h2 id='${body.data_id}'>${body.data}</h2>
          <textarea style='width:100%;max-width:100%;min-width:100%;float:left;min-height:200px;padding:10px;margin-bottom:10px;color:hsl(0,0%,30%);font-size:16px;font-family:sans-sarif' class='serviceContent'>${body.data_body}</textarea>
          <div class='btnsContainer'><button id='editServiceBody'>Save</button></div>
        `);
    },
  });
});
