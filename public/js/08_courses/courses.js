let hoverLesson = "#coursesSection .courseDiv ul .lesson .lesson_contentDiv";
$(document).on("mouseover", hoverLesson, function () {
  let hoveredItem = $(this);
  $(hoveredItem).closest(".lesson").css({ padding: "0 0 20px 0" });
});
$(document).on("mouseout", hoverLesson, function () {
  let hoveredItem = $(this);
  $(hoveredItem).closest(".lesson").css({ padding: "10px 0 10px 0" });
});

let checkSyllabus = "#coursesSection .moreCourseInfo button";
$(document).on("click", checkSyllabus, function () {
  let clickedBtn = $(this);
  $.ajax({
    method: "POST",
    url: "/courses/check_syllabus",
    success: function (body) {
      console.log(body);
      $(".absolutePage .section .subSection").html(`${body.htmlFile}`);
      $(".absolutePage").attr("class", "absolutePage");
    },
  });
});

let viewLesson = "#coursesSection .courseDiv ul .lesson";
$(document).on("click", viewLesson, function (e) {
  e.preventDefault();
  let li_element = $(this);
  let url_element = $(li_element).find("a").attr("href");
  $.ajax({
    method: "GET",
    url: url_element,
    success: function (body) {
      if (body.err_status === 401) {
        $(".absolutePage").removeClass("disabled");
        $(".absolutePage .section .subSection").html(body.htmlFile);
      } else {
        document.location.href = url_element;
      }
    },
  });
});

let sign_in_or_up_courses_ejs = "#buy_course_section .signUpOption span";
$(document).on("click", sign_in_or_up_courses_ejs, function () {
  let clickedBtn = $(this);
  if ($(clickedBtn).attr("id") === "create_new_btn") {
    $("#buy_course_section .containerContentSignIn").html(`
        <h4>Sign Up to buy course</h4>
    <div class="inputsContainer">
     <form class="sign_and_buy_course" id="sign_up_and_buy_course">
          <div class="inputContainer">
            <label for="profile_name"></label>
            <input type="text" placeholder="Full Name" name="profile_name" id="profile_name">
            <div class="inputMessageError"></div>
          </div>
          <div class="inputContainer">
            <label for="profile_email"></label>
            <input type="text" placeholder="Email" name="profile_email" id="profile_email">
            <div class="inputMessageError"></div>
          </div>
          <div class="inputContainer">
            <label for="profile_password"></label>
            <input type="password" placeholder="Password" name="profile_password" id="profile_password">
            <div class="inputMessageError"></div>
          </div>
          <div class="inputContainer">
            <label for="profile_age"></label>
            <input type="number" placeholder="Age" name="profile_age" id="profile_age">
            <div class="inputMessageError"></div>
          </div>
          <div class="inputContainer">
            <select name="communication_type" id="communication_type">
              <option value="1">I am learning sign language</option>
              <option value="2">I am deaf or hard of hearing</option>
              <option value="3">I have mutism or speech difficulties</option>
            </select>
            <div class="inputMessageError"></div>
          </div>
          <div class="inputMessageError"></div>
          <button type="submit" class="submitInfoBtn" id='signUpAndBuyCourse'>
            <span>Next</span>
            <svg viewBox="0 0 24 24">
              <path
                d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"
              ></path>
            </svg>
          </button>
        </form>
    </div>
    <div id="main-err-box"></div>
    <div class="signUpOption">
      <span id="already_have_account">Already have an account</span>
    </div>`);
  }
  if ($(clickedBtn).attr("id") === "already_have_account") {
    $("#buy_course_section .containerContentSignIn").html(`
        <h4>Log In to buy course</h4>
      <div class="inputsContainer">
      <form class="sign_and_buy_course" id="sign_in_and_buy_course">
        <div class="inputContainer">
          <label for="profile_email"></label>
          <input type="text" placeholder="Email" name="profile_email" id="profile_email">
          <div class="inputMessageError"></div>
        </div>
        <div class="inputContainer">
          <label for="profile_password"></label>
          <input type="password" placeholder="Password" name="profile_password" id="profile_password">
          <div class="inputMessageError"></div>
        </div>
        <button type="submit" class="submitInfoBtn" id='signInAndBuyCourse'>
          <span>Next</span>
          <svg viewBox="0 0 24 24">
            <path
              d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"
            ></path>
          </svg>
        </button>
      </form>
      </div>
      <div id="main-err-box"></div>
      <div class="signUpOption">
        <span id="create_new_btn">Create new account</span>
      </div>`);
  }
});

let sign_in_or_up_courses_form = "#buy_course_section .inputsContainer form";
$(document).on("submit", sign_in_or_up_courses_form, function (e) {
  e.preventDefault();
  let form_Element = $(this);
  let form_Element_id = $(form_Element).attr("id");
  let profile_email = $(form_Element).find("#profile_email").val();
  let profile_password = $(form_Element).find("#profile_password").val();
  let lesson_id = $(".absolutePage .section .subSection h2").attr("id");
  function load_payment_of_course() {
    $.ajax({
      method: "Post",
      url: `/get_lesson_details/${lesson_id}`,
      success: function (body) {
        if (body.err_status === 401) {
          alert(body.err_message);
        } else {
          $(".absolutePage .section .subSection").html(body.htmlFile);
        }
      },
    });
  }

  if (form_Element_id === "sign_in_and_buy_course") {
    let send_object = {
      prof_email: profile_email,
      prof_password: profile_password,
    };
    if (
      verifyLogIn_profile_email(profile_email) &&
      verifyLogIn_profile_password(profile_password)
    ) {
      $.ajax({
        method: "POST",
        url: "/signIn",
        data: send_object,
        success: function (body) {
          if (body.status === 401) {
            body.errBox.forEach(function (e, i) {
              $(".inputMessageError").html("");
              $(form_Element)
                .find(`${e.profile_id}`)
                .closest(".inputContainer")
                .find(".inputMessageError")
                .html(`<p>${e.errMessage}</p>`);
            });
          } else {
            $("#main-err-box").html(
              `<p class='positive_feedback'>${body.errMessage}</p>`
            );
            setTimeout(() => {
              $("#main-err-box").html(
                `<p class='positive_feedback'>Loading payment page ...</p>`
              );
              alert("Successfully logged in");
              load_payment_of_course();
            }, 1200);
          }
        },
      });
    } else {
      $("#main-err-box").html(`<p>There was error in your logging In</p>`);
    }
  }
  if (form_Element_id === "sign_up_and_buy_course") {
    let profile_name = $(form_Element).find("#profile_name").val();
    let profile_age = $(form_Element).find("#profile_age").val();
    let communication_type = $(form_Element).find("#communication_type").val();
    let send_object = {
      prof_email: profile_email,
      prof_password: profile_password,
      prof_name: profile_name,
      prof_age: profile_age,
      communication_type: communication_type,
    };

    if (
      verifyLogIn_profile_email(profile_email) &&
      verifyLogIn_profile_name(profile_name) &&
      verifyLogIn_profile_password(profile_password) &&
      verifyLogIn_profile_age(profile_age) &&
      communication_type
    ) {
      $.ajax({
        method: "POST",
        url: "/signUp",
        data: send_object,
        success: function (body) {
          if (body.err_status === 401) {
            if (body.alert) {
              alert(body.errMessage);
            } else {
              $("#main-err-box").html(`<p>${body.errMessage}</p>`);
            }
          } else {
            $("#main-err-box").html(
              `<p class='positive_feedback'>${body.errMessage}</p>`
            );
            setTimeout(() => {
              $("#main-err-box").html(
                `<p class='positive_feedback'>Loading payment page ...</p>`
              );
              alert("Successfully created your account");
            }, 1200);
          }
        },
      });
    }
  }
});

let choose_course_payment_option =
  "#buy_course_section .payment_methods_container .payment_method_type";
$(document).on("click", choose_course_payment_option, function () {
  let clickedBtn = $(this);
  $(choose_course_payment_option)
    .find(".checkbox_inputCont")
    .removeClass("checkedBox");
  $(clickedBtn).find(".checkbox_inputCont").addClass("checkedBox");
});
