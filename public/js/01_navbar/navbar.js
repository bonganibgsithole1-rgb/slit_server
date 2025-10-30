$(document).on("click", "#navbarSection #navBtns li", function () {
  let clicked_item = $(this);
  let id_element = $(this).attr("id").replace("Li", "");
  let popUp = $(`#${id_element}PopUp`);
  $("#navbarSection #navBtns li").removeClass("focused_btn");
  // if ($("#navbarSection .popUps").hasClass("focused_nav").length >0){

  // }
  $(".focused_nav").removeClass("focused_nav");
  if ($(clicked_item).hasClass("focused_btn")) {
    $(popUp).removeClass("focused_nav");
    $(`#${id_element}Li`).removeClass("focused_btn");
  } else {
    let id_element = $(this).attr("id").replace("Li", "");

    $(popUp).addClass("focused_nav");
    $(`#${id_element}Li`).addClass("focused_btn");
  }
});

$(document).on("click", "#navbarSection #navBtns li.focused_btn", function () {
  let id_element = $(this).attr("id").replace("Li", "");
  let popUp = $(`#${id_element}PopUp`);
  $(popUp).removeClass("focused_nav");
  $("#navbarSection #navBtns li").removeClass("focused_btn");
});

let borderLoader = ".border_Loading .border_loaderSpan";
$(document).ready(function () {
  $(borderLoader).css({ width: "35%" });
});
$(window).on("load", function () {
  $(borderLoader).addClass("active");
  if (("" + $(borderLoader).attr("class")).includes("active")) {
    $(borderLoader).css({ "transition-duration": "1s" });
  }
});

let news_first_phase =
  "#blogs_section .subSection .blogs_navigation .selection_container .selection_btn";
$(document).on("click", news_first_phase, function () {
  let clickedBtn = $(this);
  let phase_id = $(clickedBtn).attr("id");
  $.ajax({
    method: "POST",
    url: `/news_and_blogs/change_phase/${phase_id}`,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        $(
          "#blogs_section .subSection .blogs_navigation .selection_container .selection_btn"
        ).removeClass("focused_selection");
        $(clickedBtn)
          .closest(".subSection")
          .find(".blogs_list_ul")
          .html(body.htmlFile);
        $(clickedBtn).addClass("focused_selection");
        $(clickedBtn).html(`<span></span>`);
      }
    },
  });
});

let click_scroll_btn =
  "#blogs_section .subSection .blogs_navigation .blogs_navigators";
$(document).on("click", click_scroll_btn, function () {
  let clickedBtn = $(this);
  if ($(clickedBtn).hasClass("left_navigator")) {
    $(
      "#blogs_section .subSection .blogs_navigation .selection_container .selection_btn#first_phase"
    ).click();
  } else {
    $(
      "#blogs_section .subSection .blogs_navigation .selection_container .selection_btn#second_phase"
    ).click();
  }
});

let change_nb_tab_home = "#blogs_section .blogs_title_lists li button";
$(document).on("click", change_nb_tab_home, function () {
  let clickedBtn = $(this);
  let tab_name = $(clickedBtn).attr("id").replace("_docs", "");
  $.ajax({
    method: "POST",
    url: `/blogsAndNews/change_tab_home/${tab_name}`,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        if (body.err_status === 200) {
          $("#blogs_section .blogs_title_lists li button").removeClass(
            "active_title"
          );
          $(clickedBtn).addClass("active_title");
          $("#blogs_section .subSection .blogs_list_ul").html(
            `${body.htmlFile}`
          );
          if (
            tab_name === "all" &&
            $("#blogs_section .subSection .blogs_list_ul li").length >= 3
          ) {
            $(".blogs_navigation").html(`
      <span class="blogs_navigators left_navigator">
        <svg viewBox="0 0 24 24">
          <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z"></path>
        </svg>
      </span>
      <div class="selection_container">
        <button class="selection_btn focused_selection" id="first_phase"><span></span></button>
        
        <button class="selection_btn" id="second_phase"><span></span></button>
        
      </div>
      <span class="blogs_navigators right_navigator">
        <svg viewBox="0 0 24 24">
          <path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"></path>
        </svg>
      </span>`);
          } else {
            $(".blogs_navigation").html(`<span class="blogs_navigators">
  <svg viewBox="0 0 24 24">
    <path
      d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z"
    ></path>
  </svg>
</span>
<div class="selection_container">
  <button class="selection_btn focused_selection" id="">
    <span> </span>
  </button>
</div>
<span class="blogs_navigators">
  <svg viewBox="0 0 24 24">
    <path
      d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"
    ></path>
  </svg>
</span>`);
          }
        }
      }
    },
  });
});

let send_message_btn = "#contact_us_section .subSection .cta_container button";
$(document).on("click", send_message_btn, function () {
  let clickedBtn = $(this);
  $(".absolutePage").removeClass("disabled");

  $(
    ".absolutePage .section .subSection"
  ).html(`<div class="section" id="liveChart">
  <div class="subSection">
  <div class='sendVia'><button id='sendViaEmail' class='focused_via'>Email</button><button id='sendViaWhatsapp'>Whatsapp</button></div>
    <div class="message_container_FullWidth">
      
        <div class="right_side_Content">
          <form action="https://formsubmit.co/bonganibgsithole@gmail.com" method="POST">
            <input name="name" placeholder="Name" type="text" required="">
            <input name="email" type="email" placeholder="Email e.g johndoe@gmail.com" required="">
            <input name="subject" placeholder="Subject" type="text" required="">
            <textarea placeholder="Your Message" name="msg" id="applyForEnterpreter_message"></textarea>
            <input type="hidden" name="_captcha" value="false">
            <div class="sendBtn">
              <button type="submit">
                <svg viewBox="0 0 24 24">
                  <g id="info"></g>
                  <g id="icons">
                    <path d="M21.5,11.1l-17.9-9C2.7,1.7,1.7,2.5,2.1,3.4l2.5,6.7L16,12L4.6,13.9l-2.5,6.7c-0.3,0.9,0.6,1.7,1.5,1.2l17.9-9   C22.2,12.5,22.2,11.5,21.5,11.1z" id="send"></path>
                  </g>
                </svg>
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
    </div>
  </div>
</div>`);
});

let change_method_send_message = "#liveChart .subSection .sendVia button";
let another_method_send_message = ".emergency_contacts .more_messages_icons li";

function send_message_form(a) {
  $(document).on("click", a, function () {
    let clickedBtn = $(this);
    if ($(clickedBtn).attr("id") === "sendViaEmail") {
      $(".absolutePage .section .subSection")
        .html(`<div class="section" id="liveChart">
    <div class="subSection">
    <div class='sendVia'><button id='sendViaEmail' class='focused_via'>Email</button><button id='sendViaWhatsapp'>Whatsapp</button></div>
      <div class="message_container_FullWidth">
        
          <div class="right_side_Content">
            <form action="https://formsubmit.co/bonganibgsithole@gmail.com" method="POST">
              <input name="name" placeholder="Name" type="text" required="">
              <input name="email" type="email" placeholder="Email e.g johndoe@gmail.com" required="">
              <input name="subject" placeholder="Subject" type="text" required="">
              <textarea placeholder="Your Message" name="msg" id="applyForEnterpreter_message"></textarea>
              <input type="hidden" name="_captcha" value="false">
              <div class="sendBtn">
                <button type="submit">
                  <svg viewBox="0 0 24 24">
                    <g id="info"></g>
                    <g id="icons">
                      <path d="M21.5,11.1l-17.9-9C2.7,1.7,1.7,2.5,2.1,3.4l2.5,6.7L16,12L4.6,13.9l-2.5,6.7c-0.3,0.9,0.6,1.7,1.5,1.2l17.9-9   C22.2,12.5,22.2,11.5,21.5,11.1z" id="send"></path>
                    </g>
                  </svg>
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  </div>`);
    } else {
      $(".absolutePage .section .subSection")
        .html(`<div class="section" id="liveChart">
    <div class="subSection">
    <div class='sendVia'><button id='sendViaEmail'>Email</button><button id='sendViaWhatsapp'  class='focused_via'>Whatsapp</button></div>
      <div class="message_container_FullWidth">
        
          <div class="right_side_Content">
            <form action="" method="POST">
              <input name="name" placeholder="Name" type="text" required="">
              <input name="contact_number" type="text" placeholder="Contact Number" required="">
              <input name="subject" placeholder="Subject" type="text" required="">
              <textarea placeholder="Your Message" name="msg" id="applyForEnterpreter_message"></textarea>
              <input type="hidden" name="_captcha" value="false">
              <div class="sendBtn">
                <button type="submit">
                  <svg viewBox="0 0 24 24">
                    <g id="info"></g>
                    <g id="icons">
                      <path d="M21.5,11.1l-17.9-9C2.7,1.7,1.7,2.5,2.1,3.4l2.5,6.7L16,12L4.6,13.9l-2.5,6.7c-0.3,0.9,0.6,1.7,1.5,1.2l17.9-9   C22.2,12.5,22.2,11.5,21.5,11.1z" id="send"></path>
                    </g>
                  </svg>
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  </div>`);
    }
    $(".absolutePage").removeClass("disabled");
  });
}
send_message_form(change_method_send_message);
send_message_form(another_method_send_message);
