$(document).ready(function () {
  setInterval(() => {
    if ($(".border_Loading .border_loaderSpan.active").length > 0) {
      $(".loader").remove();
    }
  }, 1000);
  var iframe = $("#map-iframe");
  iframe.on("load", function () {
    $(".loader").hide();
  });
});
let cancelPopUpWindow = ".cancelNav button";
$(document).on("click", cancelPopUpWindow, function () {
  let clickedBtn = $(this);
  $(".absolutePage").attr("class", "absolutePage disabled");
});

// BOTTOM RIGHT MESSAGE BUTTONS
let show_emergency_contacts = ".emergency_contacts";
$(document).on("mouseenter", show_emergency_contacts, function () {
  let clicked_btn = $(this);
  let isVisible = $(clicked_btn)
    .closest(".emergency_contacts")
    .find(".more_messages_icons")
    .hasClass("hide_div");
  console.log(isVisible);
  if (isVisible) {
    setTimeout(() => {
      $(clicked_btn)
        .closest(".emergency_contacts")
        .find(".more_messages_icons")
        .removeClass("hide_div");
    }, 100);
  }
});
$(document).on("mouseleave", show_emergency_contacts, function () {
  let clicked_btn = $(this);
  let isVisible = $(clicked_btn)
    .closest(".emergency_contacts")
    .find(".more_messages_icons")
    .hasClass("hide_div");
  console.log(isVisible);
  if (!isVisible) {
    setTimeout(() => {
      $(clicked_btn)
        .closest(".emergency_contacts")
        .find(".more_messages_icons")
        .addClass("hide_div");
    }, 500);
  }
});

// HERO PAGE

// book interpreter button

let book_interpreter_btn = "#heroSection .btn_container button";
$(document).on("click", book_interpreter_btn, function () {
  let clickedBtn = $(this);
  $(".absolutePage").removeClass("disabled");

  $(".absolutePage .section .subSection").html(`
      <h3>Book An Interpreter</h3>
      <div class='hero_book_interpreter'>
        <form method='POST' action='/book_an_interpreter'>
            <div class="input_container">
              <label for="company_name">Company name</label>
              <input type="text" id='company_name' name='company_name' placeholder='' required/>
            </div>  
            <div class="input_container">
              <label for="contact_number">Contact number</label>
              <input type="number" id='contact_number' name='contact_number' placeholder='' required/>
            </div>
            <div class="input_container">
              <label for="email_address">Email Address</label>
              <input type="email" id='email_address' name='email_address' placeholder=''/>
           </div>
           <div class="input_container">
            <label for="request_date">Request date</label>
            <input type="date" id='request_date' name='request_date' placeholder='Date.now()'/>
          </div>
          <div class="input_container">
            <label for="request_time">Request time</label>
            <input type="time" id='request_time' name='request_time' />
          </div>
           <div class="input_container">
            <label for="language_to_use">Language to be used</label>
            <select name='language_to_use' id='language_to_use'>
              <option value="001">English</option>
              <option value="002">Shona</option>
              <option value="003">Ndebele</option>
              <option value="004">Other</option>
            </select>
            <input type="text" class='hide_input' placeholder="Type language ..." id='other_language' name='other_language'/>
          </div>
          <div class="input_container">
            <label for="interpretation_type">Type of request</label>
            <select name='interpretation_type' id='interpretation_type'>
              <option value="001">Interpretation</option>
              <option value="002">Phone</option>
              <option value="003">Document Transalation</option>
            </select>
          </div>
          <button id='book_interpreter_btn'><span>Submit</span>
          <svg style="enable-background:new 0 0 24 24;" viewBox="0 0 24 24"><g id="info"/><g id="icons"><path d="M21.5,11.1l-17.9-9C2.7,1.7,1.7,2.5,2.1,3.4l2.5,6.7L16,12L4.6,13.9l-2.5,6.7c-0.3,0.9,0.6,1.7,1.5,1.2l17.9-9   C22.2,12.5,22.2,11.5,21.5,11.1z" id="send"/></g></svg></button>
        </form>
      </div>
      `);
});

let form_book_interpreter = ".absolutePage div.hero_book_interpreter form";
$(document).on("submit", form_book_interpreter, (e) => {
  e.preventDefault();
  let formData = $(this);
  let company_name = $("#company_name").val();
  let contact_number = $("#contact_number").val();
  let email_address = $("#email_address").val();
  let request_date = $("#request_date").val();
  let request_time = $("#request_time").val();
  let language_to_use = $("#language_to_use").val();
  let interpretation_type = $("#interpretation_type").val();
  let other_language = $("#other_language").val();

  $.ajax({
    method: "POST",
    url: "/book_an_interpreter",
    data: {
      booking_company_name: company_name,
      booking_contact_number: contact_number,
      booking_email_address: email_address,
      booking_request_date: request_date,
      booking_request_time: request_time,
      booking_language_to_use: language_to_use,
      booking_interpretation_type: interpretation_type,
      booking_other_language: other_language,
    },
    success: function (data) {
      if (data.err_status === 401) {
        alert(data.err_message);
      } else {
        $(".absolutePage").addClass("disabled");

        $(".absolutePage .section .subSection").html("");
        alert(data.err_message);
      }
    },
  });
});

let change_language_option =
  ".absolutePage div.hero_book_interpreter .input_container select#language_to_use";
$(document).on("change", change_language_option, function (e) {
  let selectElement = $(this);
  let select_other = ~~$(selectElement).val() === 4;
  if (select_other) {
    $(selectElement)
      .closest(".input_container")
      .find("#other_language")
      .removeClass("hide_input");
  } else {
    $(selectElement)
      .closest(".input_container")
      .find("#other_language")
      .addClass("hide_input");
  }
});

let zoom_item = ".emergency_contacts .message_use_icon#zoom_icon";
$(document).on("click", zoom_item, function () {
  let clickedBtn = $(this);
  if ($(clickedBtn).hasClass("zoom_item")) {
    $(".horizontalNav").addClass("display_none");
    $("#footerSection").addClass("display_none");
    $(clickedBtn).removeClass("zoom_item");
  } else {
    $(".horizontalNav").removeClass("display_none");
    $("#footerSection").removeClass("display_none");
    $(clickedBtn).addClass("zoom_item");
  }
});

// news and blogs

let nb_change_tab = "#blogsAndNews .mini_nav_option button";
$(document).on("click", nb_change_tab, function () {
  let clickedBtn = $(this);
  let tab_name = $(clickedBtn).attr("id").replace("_docs", "");
  $.ajax({
    method: "POST",
    url: `/blogsAndNews/change_tab/${tab_name}`,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        if (body.err_status === 200) {
          $("#blogsAndNews .mini_nav_option button").removeClass(
            "focused_button"
          );
          $(clickedBtn).addClass("focused_button");
          $("#blogsAndNews .subSection").html(`${body.htmlFile}`);
        }
      }
    },
  });
});

let show_more_information_on_blog =
  "#blogsAndNews .blogLists .contenInfomation .containerview_more .view_more";

$(document).on("click", show_more_information_on_blog, function () {
  let clickedBtn = $(this);
  let blog_id = $(clickedBtn).closest(".blogLists").attr("id");
  $.ajax({
    method: "POST",
    url: `/blogsAndNews/retrieve_blog/${blog_id}`,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        $(".absolutePage").removeClass("disabled");
        $(".absolutePage .section .subSection").html(`${body.htmlFile} `);
      }
    },
  });
});
//

//home page

let click_navbar_section = ".siteMap li .about_button_more .svg_more";
$(document).on("click", click_navbar_section, function () {
  let clickedBtn = $(this);
  let section_id = $(clickedBtn).closest("li").attr("id");
  console.log(section_id);
  let li_element = document.createElement("a");
  $(li_element).attr("href", `#${section_id}Li`);
  li_element.click();
  $("#navbarSection .popUps").removeClass("focused_nav");
  $(`#${section_id}PopUp`).addClass("focused_nav");
  $("#navbarSection #navBtns li").removeClass("focused_btn");
  $(`#navbarSection #navBtns li#${section_id}Li`).addClass("focused_btn");
  $(`#${section_id}PopUp`).addClass("highlight_item");
  setTimeout(() => {
    $(`#${section_id}PopUp`).removeClass("highlight_item");
  }, 1000);
});

let signOutBtn = "#signOut";
$(document).on("click", signOutBtn, function () {
  $.ajax({
    method: "POST",
    url: "/signOut",
    success: function (body) {
      alert("Successfully signed you out");
      window.location.href = "/";
    },
  });
});
