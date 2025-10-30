let new_gallery = "#gallery_section #upload_gallery";
$(document).on("submit", new_gallery, function (e) {
  e.preventDefault();
  let formElement = $(this);
  let formData = {
    gallery_type: $(formElement).find("#gallery_type").val(),
    gallery_url: $(formElement).find("#gallery_url").val(),
    gallery_explanation: $(formElement).find("#gallery_explanation").val(),
  };
  $.ajax({
    method: "POST",
    url: "/employees/gallery/new_item",
    data: formData,
    success: function (body) {
      $(".error_message").html("");
      if (body.err_status === 401) {
        $(formElement)
          .find(".gallery_url .gallery_url_error_div")
          .html(`<p>${body.err_message}</p>`);
      }
      if (body.err_status === 200) {
        $(formElement)
          .find(".error_message#main_error_message_div")
          .html(`<p>${body.err_message}</p>`);
        $(formElement).find("input").val("");
        setTimeout(() => {
          $(formElement).find(".error_message#main_error_message_div").html(``);
        }, 900);
        $(
          `#gallery_section .container_gallery.${body.createdData.gallery_type}s_div`
        ).html(`${body.htmlFile}`);
        console.log(body.createdData._id);
        let create_href = document.createElement("a");
        $(create_href).attr("href", `#${body.createdData._id}`);
        create_href.click();
      }
    },
  });
});

let edit_delete_btn =
  "#gallery_section .container_gallery .imageDiv .btns_container button";
$(document).on("click", edit_delete_btn, function () {
  let clicked_btn = $(this);
  let clicked_btn_id = $(clicked_btn).attr("class");
  let image_div_id = $(clicked_btn).closest(".imageDiv").attr("id");
  if (clicked_btn_id === "edit_btn") {
    $(".absolutePage").removeClass("disabled");
    $.ajax({
      method: "GET",
      url: `/employees/gallery/gallery_information/${image_div_id}`,
      success: function (body) {
        if (body.err_status === 401) {
          alert(body.err_message);
        } else {
          if (body.err_status === 200) {
            $(".absolutePage .subSection").html(`
              <h3 id=${body.gallery_info._id}>Edit image info</h3>
              <div class="edit_gallery_container">
              <form action="/employees/gallery/edit_btn/${image_div_id}" id="edit_gallery">
                <select name="gallery_type" id="gallery_type">
                  <option value="image" ${
                    body.gallery_info.gallery_type === "image" ? "selected" : ""
                  }>Image</option>
                  <option value="video" ${
                    body.gallery_info.gallery_type === "video" ? "selected" : ""
                  }>Video</option>
                  </select>
                <div class="gallery_url">
                  <input type="text" name="gallery_url" id="gallery_url" placeholder="Gallery url ..." required="" value ='${
                    body.gallery_info.gallery_url
                  }'>
                  
                  <div class="gallery_url_error_div error_message"></div>
                  </div>
                  <div class="gallery_explanation">
                  <input type="text" name="gallery_explanation" id="gallery_explanation" placeholder="Gallery explanation ..." value=${
                    body.gallery_info.gallery_explanation
                  }>
                  
                  <div class="gallery_explanation_error_div error_message"></div>
                  </div>
                  
                  <div class="error_message" id="main_error_message_div"></div>
                  <div id="submit_btn_container">
                  <button class='edit_container_btn'>Edit</button>
                  </div>
                  </form>
                  </div>`);
          }
        }
      },
    });
  }
  if (clicked_btn_id === "delete_btn") {
    let user_pin = prompt("Enter pin to delete item");
    $.ajax({
      method: "POST",
      url: "/verify_employee_pin",
      data: { pin_value: user_pin },
      success: function (body) {
        if (body.err_status === 401) {
          alert(body.err_message);
        } else {
          $.ajax({
            method: "POST",
            url: `/employees/gallery/delete_btn/${image_div_id}`,
            success: function (body) {
              alert(body.err_message);
              $(
                `#gallery_section .container_gallery.${body.gallery_type}s_div`
              ).html(`${body.htmlFile}`);
            },
          });
        }
      },
    });
  }
});

let edit_btn_form =
  ".absolutePage .section .edit_gallery_container form#edit_gallery";
$(document).on("submit", edit_btn_form, function (e) {
  e.preventDefault();
  let formElement = $(this);
  let gallery_id = $(".absolutePage .section .subSection h3").attr("id");
  let formData = {
    gallery_type: $(formElement).find("#gallery_type").val(),
    gallery_url: $(formElement).find("#gallery_url").val(),
    gallery_explanation: $(formElement).find("#gallery_explanation").val(),
  };
  $.ajax({
    method: "POST",
    url: `/employees/gallery/edit_btn/${gallery_id}`,
    data: formData,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        $(".absolutePage").addClass("disabled");
        $(
          `#gallery_section .container_gallery.${body.updated_info.gallery_type}s_div`
        ).html(`${body.htmlFile}`);
        console.log(body.updated_info._id);
        let create_href = document.createElement("a");
        $(create_href).attr("href", `#${body.updated_info._id}`);
        create_href.click();
      }
    },
  });
});
