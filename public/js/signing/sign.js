function hasLetters(a) {
  let hasLettersReg = /[a-zA-Z]/g;
  return hasLettersReg.test(a);
}
function hasDigits(a) {
  let hasDigitsReg = /\d/;
  return hasDigitsReg.test(a);
}
function removeErrandErrMessage(a) {
  $(a).closest(".inputsContainer").find(".inputMessageError").html(``);
  $(a).attr("class", "");
  $(a).blur();
}

function addErrAndErrMessage(a, b) {
  $(a)
    .closest(".inputContainer")
    .find(".inputMessageError")
    .html(`<p>${b}</p>`);
  $(a).attr("class", "hasErr");
  let focusId = $($(".hasErr")[0]).attr("id");
  $(`#${focusId}`).focus();
}

function verifyLogIn_profile_name(a) {
  if (a.length >= 3) {
    removeErrandErrMessage("#profile_name");
    return true;
  } else {
    let errObject = {
      errMessage: `Profile name should have at least 3 characters`,
    };
    addErrAndErrMessage("#profile_name", errObject.errMessage);
    return false;
  }
}
function verifyLogIn_profile_email(b) {
  if (b.includes("@")) {
    if (!b.includes(" ")) {
      if (b.lastIndexOf("@") >= 3) {
        if (b.includes(".")) {
          lastAtPos = b.lastIndexOf("@");
          lastDotPos = b.lastIndexOf(".");
          if (lastDotPos > lastAtPos) {
            if (!b.includes("..")) {
              if (!b.includes("@@")) {
                if (b.length - lastDotPos > 2) {
                  if (lastDotPos - lastAtPos > 1) {
                    removeErrandErrMessage("#profile_email");
                    return true;
                  } else {
                    let errObject = {
                      errMessage: `Email must contain characters between last '@' and '.' characters`,
                    };
                    addErrAndErrMessage("#profile_email", errObject.errMessage);
                    return false;
                  }
                } else {
                  let errObject = {
                    errMessage: `Email must contain more than 2 characters after '.'`,
                  };
                  addErrAndErrMessage("#profile_email", errObject.errMessage);
                  return false;
                }
              } else {
                let errObject = {
                  errMessage: `There should be no '@@' in your email`,
                };
                addErrAndErrMessage("#profile_email", errObject.errMessage);
                return false;
              }
            } else {
              let errObject = {
                errMessage: `There should be no '..' in your email`,
              };
              addErrAndErrMessage("#profile_email", errObject.errMessage);
              return false;
            }
          } else {
            let errObject = {
              errMessage: `Last '@' character should be before last '.' character eg JohnDoe123@gmail.com`,
            };
            addErrAndErrMessage("#profile_email", errObject.errMessage);
            return false;
          }
        } else {
          let errObject = {
            errMessage: `Email must contain '.' character after '@' eg JohnDoe123@gmail.com`,
          };
          addErrAndErrMessage("#profile_email", errObject.errMessage);
          return false;
        }
      } else {
        let errObject = {
          errMessage: `Email must contain more than 3 characters before '@'`,
        };
        addErrAndErrMessage("#profile_email", errObject.errMessage);
        return false;
      }
    } else {
      let errObject = {
        errMessage: `Please remove any empty spaces in your email address`,
      };
      addErrAndErrMessage("#profile_email", errObject.errMessage);
      return false;
    }
  } else {
    let errObject = {
      errMessage: `Please include an '@' in the email address`,
    };
    addErrAndErrMessage("#profile_email", errObject.errMessage);
    return false;
  }
}
function verifyLogIn_profile_password(c) {
  if (c.length > 7) {
    if (hasDigits(c)) {
      if (hasLetters(c)) {
        removeErrandErrMessage("#profile_password");
        return true;
      } else {
        let errObject = {
          errMessage: `Email must contain at least one letter`,
        };
        addErrAndErrMessage("#profile_password", errObject.errMessage);
        return false;
      }
    } else {
      let errObject = {
        errMessage: `Password must contain at least one digit`,
      };
      addErrAndErrMessage("#profile_password", errObject.errMessage);
      return false;
    }
  } else {
    let errObject = {
      errMessage: `Password must be at least 8 characters or more`,
    };
    addErrAndErrMessage("#profile_password", errObject.errMessage);
    return false;
  }
}
function verifyLogIn_profile_age(e) {
  if (e > 15) {
    removeErrandErrMessage("#profile_age");
    return true;
  } else {
    let errObject = {
      errMessage: `Age should be a digit and of valid value`,
    };
    addErrAndErrMessage("#profile_age", errObject.errMessage);
    return false;
  }
}
//
window.onload = function () {
  let generateRandomInput = "#employee_verification_code";
  $(generateRandomInput).val(generateRandom());
};

//
let createNewUserForm = "#slitSignUp";
$(document).on("submit", createNewUserForm, function (e) {
  e.preventDefault();
  let formElem = $(this);
  $("#main-err-box").html(``);
  let prof_name = $(formElem).find("#profile_name").val();
  let prof_email = $(formElem).find("#profile_email").val();
  let prof_password = $(formElem).find("#profile_password").val();
  let prof_age = ~~$(formElem).find("#profile_age").val();
  let communication_type = ~~$(formElem).find("#communication_type").val();
  verifyLogIn_profile_name(prof_name);
  verifyLogIn_profile_email(prof_email);
  verifyLogIn_profile_password(prof_password);
  verifyLogIn_profile_age(prof_age);
  if (
    verifyLogIn_profile_email(prof_email) &&
    verifyLogIn_profile_name(prof_name) &&
    verifyLogIn_profile_password(prof_password) &&
    verifyLogIn_profile_age(prof_age) &&
    communication_type
  ) {
    let sendInfoObject = {
      prof_password: prof_password,
      prof_email: prof_email,
      prof_name: prof_name,
      prof_age: prof_age,
      communication_type: communication_type,
    };
    $.ajax({
      method: "POST",
      url: "/signUp",
      data: sendInfoObject,
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
              `<p class='positive_feedback'>Redirecting to home page</p>`
            );
            alert("Successfully created your account");
            window.location.href = "/";
          }, 1200);
        }
      },
    });
  }
});

//
let signInUserForm = "#slitSignIn";
$(document).on("submit", signInUserForm, function (e) {
  e.preventDefault();
  console.log("hello world");
  $("#main-err-box").html(``);
  let formElem = $(this);
  let prof_email = $(formElem).find("#profile_email").val();
  let prof_password = $(formElem).find("#profile_password").val();
  verifyLogIn_profile_email(prof_email);
  verifyLogIn_profile_password(prof_password);
  if (
    verifyLogIn_profile_password(prof_password) &&
    verifyLogIn_profile_email(prof_email)
  ) {
    $.ajax({
      method: "POST",
      url: "/signIn",
      data: { prof_email: prof_email, prof_password: prof_password },
      success: function (body) {
        if (body.status === 401) {
          body.errBox.forEach(function (e, i) {
            $(".inputMessageError").html("");
            $(formElem)
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
              `<p class='positive_feedback'>Redirecting ...</p>`
            );
            alert("Successfully logged in");
            window.location.href = "/";
          }, 1200);
        }
      },
    });
  } else {
    $("#main-err-box").html(`<p>There was error in your logging In</p>`);
  }
});

let signUpEmployeeForm = "#slitSignUp_employee";
$(document).on("submit", signUpEmployeeForm, function (e) {
  e.preventDefault();
  $(`#signInSection .mesage_signUpContainer`).html("");
  let form_sign_up_employee = $(this);
  let employee_name = $(form_sign_up_employee).find("#employee_name").val();
  let employee_email = $(form_sign_up_employee).find("#employee_email").val();
  let employee_password = $(form_sign_up_employee)
    .find("#employee_password")
    .val();
  let confirm_password = $(form_sign_up_employee)
    .find("#employee_confirm_password")
    .val();
  let employee_dob = $(form_sign_up_employee).find("#employee_dob").val();
  let employee_verification_code = $(form_sign_up_employee)
    .find("#employee_verification_code")
    .val();
  let employee_pin = $(form_sign_up_employee).find("#employee_pin").val();
  if (`${employee_pin}`.length === 4) {
    if (confirm_password === employee_password) {
      $.ajax({
        method: "POST",
        url: "/sign_up/employee",
        data: {
          employee_name: employee_name,
          employee_email: employee_email,
          employee_password: employee_password,
          employee_dob: employee_dob,
          employee_verification_code: employee_verification_code,
          employee_pin: employee_pin,
        },
        success: function (body) {
          if (~~body.err_status === 200) {
            $(`#signInSection .inputsContainer .inputContainer input`).val("");
            $(`#signInSection .inputsContainer .inputContainer select`).val("");
            $("#signInSection .inputsContainer form").remove();
          }

          $(`#signInSection .mesage_signUpContainer`).html(
            `<span class='message_span ${
              ~~body.err_status === 401 ? "err_negative" : "err_positive"
            }'>
          ${body.err_message}  
          </span>`
          );
        },
      });
    } else {
      $(`#signInSection .mesage_signUpContainer`).html(
        `<span class='message_span err_negative'>
        Password and confirmation do not match
      </span>`
      );
    }
  } else {
    $("#employee_pin")
      .closest(".inputContainer")
      .find(".inputMessageError")
      .html(`<p>Pin should 4 digits</p>`);
  }
});

let signInEmployeeForm = "#slitSignIn_employee";
$(document).on("submit", signInEmployeeForm, function (e) {
  e.preventDefault();
  $(`#signInSection .mesage_signUpContainer`).html("");
  let form_sign_up_employee = $(this);
  let employee_email = $(form_sign_up_employee).find("#employee_email").val();
  let employee_password = $(form_sign_up_employee)
    .find("#employee_password")
    .val();
  $.ajax({
    method: "POST",
    url: "/sign_in/employee",
    data: {
      employee_email: employee_email,
      employee_password: employee_password,
    },
    success: function (body) {
      console.log(body);
      if (~~body.status === 200) {
        console.log("go foward");
        $(`#signInSection .mesage_signUpContainer`).html(
          `<span class='message_span err_positive'>
          ${body.errMessage}
          </span>`
        );
        $("#signInSection .inputsContainer .inputContainer input").val("");
        $("#signInSection .inputsContainer .inputContainer select").val("");
        setTimeout(() => {
          $(`#signInSection .mesage_signUpContainer`).html(
            `<span class='message_span err_positive'>
          Redirect ...
          </span>`
          );
        }, 800);
        setTimeout(() => {
          let a = document.createElement("a");
          $(a).attr("href", "/employees/home");
          $(`#signInSection .mesage_signUpContainer`).html("");
          a.click();
        }, 1900);
      } else {
        $(`#signInSection .mesage_signUpContainer`).html(
          `<span class='message_span ${
            ~~body.status === 401 ? "err_negative" : "err_positive"
          }'>
          ${body.errMessage}
          </span>`
        );
      }
    },
  });
});

//
let svgEye =
  ".miniWindow form .inputsContainer .inputWithEyeContainer .svgContainer #eyeSvg";
$(document).on("click", svgEye, function () {
  let clickedBtn = $(this);
  let clickedBtn_class = $(clickedBtn).attr("class");
  let focusInput = $(clickedBtn)
    .closest(".inputWithEyeContainer")
    .find("input");
  if (clickedBtn_class === "inputPassword") {
    $(focusInput).attr("type", "text");
    $(clickedBtn).closest(".svgContainer")
      .html(`<svg aria-hidden="true" id="eyeSvg" class="inputText" width="16" height="16" viewBox="0 0 18 18">
                                        <path d="m14.53 6.3.28.67C17 7.77 17 7.86 17 8.12V9.8c0 .26 0 .35-2.18 1.22l-.27.66c.98 2.11.91 2.18.73 2.37l-1.3 1.29h-.15c-.2 0-.91-.27-2.14-.8l-.66.27C10.23 17 10.13 17 9.88 17H8.2c-.26 0-.35 0-1.21-2.18l-.67-.27c-1.81.84-2.03.84-2.1.84h-.14l-.12-.1-1.19-1.2c-.18-.18-.24-.25.7-2.4l-.28-.65C1 10.24 1 10.14 1 9.88V8.2c0-.27 0-.35 2.18-1.21l.27-.66c-.98-2.12-.91-2.19-.72-2.39l1.28-1.28h.16c.2 0 .91.28 2.14.8l.66-.27C7.77 1 7.87 1 8.12 1H9.8c.26 0 .34 0 1.2 2.18l.67.28c1.82-.84 2.03-.84 2.1-.84h.14l.12.1 1.2 1.19c.18.18.24.25-.7 2.4Zm-8.4 3.9a3.1 3.1 0 1 0 5.73-2.4 3.1 3.1 0 0 0-5.72 2.4Z">
                                        </path>
                                    </svg>`);
  } else {
    if (clickedBtn_class === "inputText") {
      $(focusInput).attr("type", "password");
      $(clickedBtn).closest(".svgContainer")
        .html(`<svg aria-hidden="true" id='eyeSvg' class="inputPassword" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M9.24 1a3 3 0 0 0-2.12.88l-5.7 5.7a2 2 0 0 0-.38 2.31 3 3 0 0 1 .67-1.01l6-6A3 3 0 0 1 9.83 2H14a3 3 0 0 1 .79.1A2 2 0 0 0 13 1H9.24Z" opacity=".4"></path>
                            <path d="M9.83 3a2 2 0 0 0-1.42.59l-6 6a2 2 0 0 0 0 2.82L6.6 16.6a2 2 0 0 0 2.82 0l6-6A2 2 0 0 0 16 9.17V5a2 2 0 0 0-2-2H9.83ZM12 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z">
                            </path>
                        </svg>`);
    }
  }
});
let employee_logOut = ".horizontalNav span.pageChoosen button#employee_logOut";
$(document).on("click", employee_logOut, function () {
  let clickedBtn = $(this);
  $.ajax({
    method: "POST",
    url: "/employee/logOut",
    success: function (body) {
      if (body.err_status === 200) {
        $("h3.name_tag").addClass("redirecting");
        $("h3.name_tag").html(`<span>${body.errMessage}</span>`);
        setTimeout(() => {
          $("h3.name_tag").html(`<span>redirecting ...</span>`);
        }, 900);
        setTimeout(() => {
          let a = document.createElement("a");
          $(a).attr("href", "/");
          a.click();
        }, 1500);
      }
    },
  });
});

function generateRandom() {
  let number = "";
  for (let i = 0; i < 5; i++) {
    number = number + Math.floor(Math.random() * 10);
  }
  let letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${letter}${number}`;
}

let activate_account = "#employee_lists_section ul.employee_lists li button";
$(document).on("click", activate_account, function () {
  let clickedBtn = $(this);
  let btn_id = $(clickedBtn).attr("id");
  let employee_id = $(clickedBtn).closest(".employee_row").attr("id");
  console.log(btn_id);
  if (btn_id === "active_status") {
    let veri_code = prompt("Enter verification code");
    $.ajax({
      method: "POST",
      url: `/employee/verify_employee/${employee_id}/${veri_code}`,
      success: function (body) {
        if (body.err_status === 401) {
          alert(`${body.err_message}`);
        } else {
          $(clickedBtn).html("Deactivate");
          $(clickedBtn).attr("id", "deactive_status");
          alert("Successfully verified account");
        }
      },
    });
  }
  if (btn_id === "deactive_status") {
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
            url: `/employee/diactivate/${employee_id}/${user_pin}`,
            success: function (body) {
              if (body.err_status === 401) {
                alert(`${body.err_message}`);
              } else {
                alert(body.err_message);
                $(clickedBtn).html("Activate");
                $(clickedBtn).attr("id", "active_status");
                alert("Successfully deactivated account");
              }
            },
          });
        }
      },
    });
  }
  if (btn_id === "manage") {
    $(".absolutePage").removeClass("disabled");
    $.ajax({
      method: "POST",
      url: `/employees/manage_employees/${employee_id}`,
      success: function (body) {
        console.log(body);
        $(".absolutePage .section .subSection").html(` ${body.htmlFile}`);
      },
    });
  }
});

let edit_employee_role = "#edit_employee_role";
$(document).on("submit", edit_employee_role, function (e) {
  e.preventDefault();
  let employee_id = $(".employee_id").attr("id");
  let formElement = $(this);
  console.log(formElement);
  let manage_employees = $(formElement)
    .find('input[name="can_edit_employees"]:checked')
    .val();
  let manage_calander = $(formElement)
    .find('input[name="can_edit_calander"]:checked')
    .val();
  let manage_blogsandnews = $(formElement)
    .find('input[name="can_edit_nandb"]:checked')
    .val();
  let manage_appointments = $(formElement)
    .find('input[name="can_booking_notification"]:checked')
    .val();
  let manage_courses = $(formElement)
    .find('input[name="can_edit_online_lessons"]:checked')
    .val();
  let manage_gallery = $(formElement)
    .find('input[name="can_edit_gallery"]:checked')
    .val();
  let sendData = {
    manage_appointments:
      ("" + manage_appointments).trim() === "off" ? false : true,
    manage_newsandblogs:
      ("" + manage_blogsandnews).trim() === "off" ? false : true,
    manage_calander: ("" + manage_calander).trim() === "off" ? false : true,
    manage_courses: ("" + manage_courses).trim() === "off" ? false : true,
    manage_employees: ("" + manage_employees).trim() === "off" ? false : true,
    manage_gallery: ("" + manage_gallery).trim() === "off" ? false : true,
  };
  $.ajax({
    method: "POST",
    url: `/employees/manage_employees/edit_employees/${employee_id}`,
    data: sendData,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        alert(body.err_message);
        $(".absolutePage .section .subSection").html(` ${body.htmlFile}`);
      }
    },
  });
});

let open_booking =
  "#homeEmployeeSection .subSection .booking_lists li #view_more_on_booking";
$(document).on("click", open_booking, function () {
  let clickedBtn = $(this);
  let booking_id = $(clickedBtn).closest("li").attr("id");
  let show_summary = $(clickedBtn).hasClass("load_summary");
  $.ajax({
    method: "POST",
    url: `/employees/manage_booking/${booking_id}`,
    data: { show_summary: show_summary },
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      }
      if (body.err_status === 200) {
        $(".absolutePage").removeClass("disabled");
        $(".absolutePage .section .subSection").html(`${body.htmlFile}`);
      }
    },
  });
});

let submit_summary = "form#booking_summary_form";
$(document).on("submit", submit_summary, function (e) {
  e.preventDefault();
  let formElement = $(this);
  let booking_summary = $(formElement).find("#booking_summary").val();
  console.log(booking_summary);
  let booking_id = $(formElement).attr("class");
  $.ajax({
    method: "POST",
    url: `/employees/add_summary/${booking_id}`,
    data: { booking_summary: booking_summary },
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        alert(body.err_message);
        $(".absolutePage").addClass("disabled");
        $(".absolutePage .section .subSection").html(``);
        window.location.reload();
      }
    },
  });
});

let image_video_select =
  ".sectionCourses .subSection .subSectionCourseLists .textAreaSection select#slide_type";
$(document).on("change", image_video_select, function () {
  let select_input = $(this);
  let select_input_val = $(select_input).val();
  if (select_input_val === "image") {
    $(
      ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .slide_video_or_image_link input"
    ).attr("class", "");
    $(
      ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .slide_video_or_image_link input#slide_url_Video"
    ).attr("class", "slide_type_hidden");
  }
  if (select_input_val === "video") {
    $(
      ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .slide_video_or_image_link input"
    ).attr("class", "");
    $(
      ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .slide_video_or_image_link input#slide_url_image"
    ).attr("class", "slide_type_hidden");
  }
});

let slide_content_type =
  ".sectionCourses .subSection .subSectionCourseLists .textAreaSection select#slide_content_type";
$(document).on("change", slide_content_type, function () {
  let select_input = $(this);
  let select_input_val = $(select_input).val();
  $(".sectionCourses .error_message").html("");
  if (
    select_input_val === "to_do_list" ||
    select_input_val === "dig_deeper" ||
    select_input_val === "summary"
  ) {
    $(select_input)
      .closest(".textAreaSection")
      .find("#slide_content_title")
      .removeClass("slide_content_hidden");
    $(select_input)
      .closest(".textAreaSection")
      .find(".saved_to_do_lists")
      .html("");
    $(select_input)
      .closest(".textAreaSection")
      .find("#slide_body")
      .attr("class", "slide_content_hidden");
    $(select_input)
      .closest(".textAreaSection")
      .find(".to_do_list_inputs")
      .attr("class", "to_do_list_inputs");
    $(select_input)
      .closest(".textAreaSection")
      .find(".to_do_list_container")
      .attr("class", "to_do_list_container anchor_doesnt_exists");
    if (select_input_val === "dig_deeper") {
      $(select_input)
        .closest(".textAreaSection")
        .find(".to_do_list_container")
        .attr("class", "to_do_list_container");
    }
  } else {
    if (select_input_val === "slide_video_image_view") {
      $(select_input)
        .closest(".textAreaSection")
        .find("#slide_body")
        .attr("class", "");
      $(select_input)
        .closest(".textAreaSection")
        .find("#slide_content_title")
        .addClass("slide_content_hidden");
      $(select_input)
        .closest(".textAreaSection")
        .find(".to_do_list_inputs")
        .attr("class", "to_do_list_inputs slide_content_hidden");
    }
    if (select_input_val === "whats_next") {
      $(select_input)
        .closest(".textAreaSection")
        .find("#slide_content_title")
        .removeClass("slide_content_hidden");
      $(select_input)
        .closest(".textAreaSection")
        .find("#slide_body")
        .attr("class", "slide_content_hidden");
      $(select_input)
        .closest(".textAreaSection")
        .find(".to_do_list_inputs")
        .attr("class", "to_do_list_inputs slide_content_hidden");
    }
  }
});

let save_to_do_list =
  ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .to_do_list_container button#save_to_do";
$(document).on("click", save_to_do_list, function (e) {
  e.preventDefault();
  $(
    `.sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .error_message`
  ).html("");
  let clickedBtn = $(this);
  let to_do_list_title = $(clickedBtn)
    .closest(".to_do_list_container")
    .find("#to_do_list_title")
    .val();
  let title_has_content = ("" + to_do_list_title).replace(" ", "").length > 0;
  let does_not_have_anchor_tag = $(clickedBtn)
    .closest(".to_do_list_container")
    .hasClass("anchor_doesnt_exists");
  if (does_not_have_anchor_tag && title_has_content) {
    $(clickedBtn).closest(".to_do_list_inputs").find(".saved_to_do_lists")
      .append(`<li>
                  <span class="limittoone">${to_do_list_title}</span>
                  <button>delete</button>
                </li>`);
    $(
      ".sectionCourses .subSection .subSectionCourseLists .textAreaSection input.to_do_list_input"
    ).val("");
    return $("#to_do_list_title").focus();
  } else {
    if (
      !does_not_have_anchor_tag &&
      title_has_content &&
      (
        "" +
        $(clickedBtn)
          .closest(".to_do_list_container")
          .find("#to_do_list_anchor")
          .val()
      ).replace(" ", "").length > 0
    ) {
      $(clickedBtn).closest(".to_do_list_inputs").find(".saved_to_do_lists")
        .append(`<li>
                  <span class="limittoone"><a href='${$(clickedBtn)
                    .closest(".to_do_list_container")
                    .find("#to_do_list_anchor")
                    .val()}'>${to_do_list_title} </a></span>
                  <button>delete</button>
                </li>`);
      $(
        ".sectionCourses .subSection .subSectionCourseLists .textAreaSection input.to_do_list_input"
      ).val("");
      return $("#to_do_list_title").focus();
    } else {
      $(
        `.sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .error_message`
      ).html(`<span>Fill all inputs to save</span>`);
      $("#to_do_list_anchor").focus();
    }
  }
});

$(document).on("ready", function () {
  $(document).on("submit", "#create_new_slide", function (e) {
    e.preventDefault();
    $(".error_message").html(``);
    let formElem = $(this);
    let urlString = $(formElem).attr("action");
    let redirectString = urlString.replace("newSlide", "view");
    let slide_number = $(formElem).find("#slide_number").val().replace(" ", "");
    let slide_type = $(formElem).find("#slide_type").val().replace(" ", "");
    let slide_url_Video = $(formElem)
      .find("#slide_url_Video")
      .val()
      .replace(" ", "");
    let slide_url_Image = $(formElem)
      .find("#slide_url_image")
      .val()
      .replace(" ", "");
    let slide_content_type = $(formElem)
      .find("#slide_content_type")
      .val()
      .replace(" ", "");
    let slide_content_title = $(formElem)
      .find("#slide_content_title")
      .val()
      .replace(" ", "");
    let slide_body = $(formElem).find("#slide_body").val().replace(" ", "");
    let saved_to_do_lists = $(formElem).find(".saved_to_do_lists");
    let are_there_saved_elements = $(saved_to_do_lists).find("li").length > 0;
    let dataToServer = {
      slide_number: slide_number,
      slide_type: slide_type,
      slide_type_url:
        slide_type === "video"
          ? $(formElem).find("#slide_url_Video").val()
          : $(formElem).find("#slide_url_image").val(),
      slide_content_type: $(formElem).find("#slide_content_type").val(),
    };
    if (
      (slide_type === "video" && "" + slide_url_Video.length > 0) ||
      (slide_type === "image" && "" + slide_url_Image.length > 0)
    ) {
      if (
        slide_content_type === "to_do_list" ||
        slide_content_type === "dig_deeper" ||
        slide_content_type === "summary" ||
        slide_content_type === "whats_next"
      ) {
        if (
          $(formElem).find("#to_do_list_title").val().replace(" ", "").length >
            0 ||
          $(formElem).find("#to_do_list_anchor").val().replace(" ", "").length >
            0
        ) {
          $(formElem)
            .find(".to_do_list_inputs .error_message")
            .html(`<span>Save contents before submission</span>`);
          return $(formElem).find("#to_do_list_title").focus();
        } else {
          if (slide_content_title.length > 0) {
            if (are_there_saved_elements) {
              let target_elements =
                ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .saved_to_do_lists li";
              let arrToSend = [];
              $(target_elements).each((number, element) => {
                let html_of_element = (
                  "" + $(element).find("span").html()
                ).trim();
                arrToSend.push(html_of_element);
              });
              //
              dataToServer.slide_content_title = (
                "" + $(formElem).find("#slide_content_title").val()
              ).trim();
              dataToServer.slide_to_do_list_arr = arrToSend;
              dataToServer.slide_body = null;
              //
              $.ajax({
                method: "POST",
                url: urlString,
                data: dataToServer,
                success: function (body) {
                  if (
                    body.err_status === 401 &&
                    body.err_type === "slide_number"
                  ) {
                    $(formElem)
                      .find(".slide_number_container .error_message")
                      .html(`<span>${body.err_message}</span>`);
                    $(formElem).find("#slide_number").focus();
                  } else {
                    if (body.err_status === 401) {
                      $(formElem)
                        .find(".btnContainer .error_message")
                        .html(
                          `<span class='negative_fb'>${body.err_message}</span>`
                        );
                    } else {
                      if (body.err_status === 200) {
                        $(formElem).find("input").val("");
                        $(formElem).find(".saved_to_do_lists").html("");
                        $(formElem)
                          .find(".btnContainer .error_message")
                          .html(
                            `<span class='positive_fb'>${body.err_message}</span>`
                          );
                        setTimeout(() => {
                          $(formElem)
                            .find(".btnContainer .error_message .positive_fb")
                            .html(`Redirecting ...`);
                          setTimeout(() => {
                            window.location.href = redirectString;
                          }, 400);
                        }, 1000);
                      }
                    }
                  }
                },
              });
            } else {
              $(
                ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .error_message"
              ).html(`<span>Save element firstly to continue</span>`);
              if ($("#to_do_list_title").val().replace(" ", "").length > 0) {
                return $("#to_do_list_anchor").focus();
              } else {
                return $("#to_do_list_title").focus();
              }
            }
          } else {
            $(formElem)
              .find(".selected_content_title #error_message1")
              .html(`<span>Field content title is required</span>`);
            return $(formElem).find("#slide_content_title").focus();
          }
        }
      } else {
        if (slide_body.length > 0) {
          dataToServer.slide_body = (
            "" + $(formElem).find("#slide_body").val()
          ).trim();
          dataToServer.slide_to_do_list_arr = null;
          $.ajax({
            method: "POST",
            url: urlString,
            data: dataToServer,
            success: function (body) {
              if (body.err_status === 401 && body.err_type === "slide_number") {
                $(formElem)
                  .find(".slide_number_container .error_message")
                  .html(`<span>${body.err_message}</span>`);
                $(formElem).find("#slide_number").focus();
              } else {
                if (body.err_status === 401) {
                  $(formElem)
                    .find(".btnContainer .error_message")
                    .html(
                      `<span class='negative_fb'>${body.err_message}</span>`
                    );
                } else {
                  if (body.err_status === 200) {
                    $(formElem).find("input").val("");
                    $(formElem).find("textarea").html("");
                    $(formElem).find(".saved_to_do_lists").html("");
                    $(formElem)
                      .find(".btnContainer .error_message")
                      .html(
                        `<span class='positive_fb'>${body.err_message}</span>`
                      );
                    setTimeout(() => {
                      $(formElem)
                        .find(".btnContainer .error_message .positive_fb")
                        .html(`Redirecting ...`);
                      setTimeout(() => {
                        window.location.href = redirectString;
                      }, 400);
                    }, 1000);
                  }
                }
              }
            },
          });
        } else {
          $(formElem)
            .find(".selected_content_title #error_message1")
            .html(`<span>Field content title is required</span>`);
          return $(formElem).find("#slide_body").focus();
        }
      }
    } else {
      $(formElem)
        .find(".slide_video_or_image_link .error_message")
        .html(`<span>Form field required</span>`);
      if (slide_type === "video") {
        return $(formElem).find("#slide_url_Video").focus();
      }
      if (slide_type === "image") {
        return $(formElem).find("#slide_url_image").focus();
      }
    }
  });
  $(document).on("submit", "#edit_slide", function (e) {
    e.preventDefault();
    $(".error_message").html(``);
    let formElem = $(this);
    let urlString = $(formElem).attr("action");
    let redirectString = urlString.replace("newSlide", "view");
    let slide_number = $(formElem).find("#slide_number").val().replace(" ", "");
    let slide_type = $(formElem).find("#slide_type").val().replace(" ", "");
    let slide_url_Video = $(formElem)
      .find("#slide_url_Video")
      .val()
      .replace(" ", "");
    let course_id = $(".course_id").attr("id");
    let lesson_id = $(".lesson_id").attr("id");
    let slide_id = $(".slide_id").attr("id");
    let slide_url_Image = $(formElem)
      .find("#slide_url_image")
      .val()
      .replace(" ", "");
    let slide_content_type = $(formElem)
      .find("#slide_content_type")
      .val()
      .replace(" ", "");
    let slide_content_title = $(formElem)
      .find("#slide_content_title")
      .val()
      .replace(" ", "");
    let slide_body = ("" + $(formElem).find("#slide_body").val()).replace(
      " ",
      ""
    );
    let saved_to_do_lists = $(formElem).find(".saved_to_do_lists");
    let are_there_saved_elements = $(saved_to_do_lists).find("li").length > 0;
    let dataToServer = {
      slide_number: slide_number,
      slide_type: slide_type,
      slide_type_url:
        slide_type === "video"
          ? $(formElem).find("#slide_url_Video").val()
          : $(formElem).find("#slide_url_image").val(),
      slide_content_type: $(formElem).find("#slide_content_type").val(),
    };
    if (
      (slide_type === "video" && "" + slide_url_Video.length > 0) ||
      (slide_type === "image" && "" + slide_url_Image.length > 0)
    ) {
      if (
        slide_content_type === "to_do_list" ||
        slide_content_type === "dig_deeper" ||
        slide_content_type === "summary" ||
        slide_content_type === "whats_next"
      ) {
        if (
          $(formElem).find("#to_do_list_title").val().replace(" ", "").length >
            0 ||
          $(formElem).find("#to_do_list_anchor").val().replace(" ", "").length >
            0
        ) {
          $(formElem)
            .find(".to_do_list_inputs .error_message")
            .html(`<span>Save contents before submission</span>`);
          return $(formElem).find("#to_do_list_title").focus();
        } else {
          if (slide_content_title.length > 0) {
            if (are_there_saved_elements) {
              let target_elements =
                ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .saved_to_do_lists li";
              let arrToSend = [];
              $(target_elements).each((number, element) => {
                let html_of_element = (
                  "" + $(element).find("span").html()
                ).trim();
                arrToSend.push(html_of_element);
              });
              //
              dataToServer.slide_content_title = (
                "" + $(formElem).find("#slide_content_title").val()
              ).trim();
              dataToServer.slide_to_do_list_arr = arrToSend;
              dataToServer.slide_body = null;
              //
              $.ajax({
                method: "POST",
                url: urlString,
                data: dataToServer,
                success: function (body) {
                  if (
                    body.err_status === 401 &&
                    body.err_type === "slide_number"
                  ) {
                    $(formElem)
                      .find(".slide_number_container .error_message")
                      .html(`<span>${body.err_message}</span>`);
                    $(formElem).find("#slide_number").focus();
                  } else {
                    if (body.err_status === 401) {
                      $(formElem)
                        .find(".btnContainer .error_message")
                        .html(
                          `<span class='negative_fb'>${body.err_message}</span>`
                        );
                    } else {
                      if (body.err_status === 200) {
                        $(formElem).find("input").val("");
                        $(formElem).find(".saved_to_do_lists").html("");
                        $(formElem)
                          .find(".btnContainer .error_message")
                          .html(
                            `<span class='positive_fb'>${body.err_message}</span>`
                          );
                        setTimeout(() => {
                          $(formElem)
                            .find(".btnContainer .error_message .positive_fb")
                            .html(`Redirecting ...`);
                          setTimeout(() => {
                            window.location.href = `/employees/courses/${course_id}/lesson/${lesson_id}/slide/${slide_id}`;
                          }, 400);
                        }, 1000);
                      }
                    }
                  }
                },
              });
            } else {
              $(
                ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .error_message"
              ).html(`<span>Save element firstly to continue</span>`);
              if ($("#to_do_list_title").val().replace(" ", "").length > 0) {
                return $("#to_do_list_anchor").focus();
              } else {
                return $("#to_do_list_title").focus();
              }
            }
          } else {
            $(formElem)
              .find(".selected_content_title #error_message1")
              .html(`<span>Field content title is required</span>`);
            return $(formElem).find("#slide_content_title").focus();
          }
        }
      } else {
        if (slide_body.length > 0) {
          dataToServer.slide_body = (
            "" + $(formElem).find("#slide_body").val()
          ).trim();
          dataToServer.slide_to_do_list_arr = null;
          $.ajax({
            method: "POST",
            url: urlString,
            data: dataToServer,
            success: function (body) {
              if (body.err_status === 401 && body.err_type === "slide_number") {
                $(formElem)
                  .find(".slide_number_container .error_message")
                  .html(`<span>${body.err_message}</span>`);
                $(formElem).find("#slide_number").focus();
              } else {
                if (body.err_status === 401) {
                  $(formElem)
                    .find(".btnContainer .error_message")
                    .html(
                      `<span class='negative_fb'>${body.err_message}</span>`
                    );
                } else {
                  if (body.err_status === 200) {
                    $(formElem).find("input").val("");
                    $(formElem).find("textarea").html("");
                    $(formElem).find(".saved_to_do_lists").html("");
                    $(formElem)
                      .find(".btnContainer .error_message")
                      .html(
                        `<span class='positive_fb'>${body.err_message}</span>`
                      );
                    setTimeout(() => {
                      $(formElem)
                        .find(".btnContainer .error_message .positive_fb")
                        .html(`Redirecting ...`);
                      setTimeout(() => {
                        window.location.href = `/employees/courses/${course_id}/lesson/${lesson_id}/slide/${slide_id}`;
                      }, 400);
                    }, 1000);
                  }
                }
              }
            },
          });
        } else {
          $(formElem)
            .find(".selected_content_title #error_message1")
            .html(`<span>Field content title is required</span>`);
          return $(formElem).find("#slide_body").focus();
        }
      }
    } else {
      $(formElem)
        .find(".slide_video_or_image_link .error_message")
        .html(`<span>Form field required</span>`);
      if (slide_type === "video") {
        return $(formElem).find("#slide_url_Video").focus();
      }
      if (slide_type === "image") {
        return $(formElem).find("#slide_url_image").focus();
      }
    }
  });
});

let delete_to_do_list =
  ".sectionCourses .subSection .subSectionCourseLists .textAreaSection .to_do_list_inputs .saved_to_do_lists li button";

$(document).on("click", delete_to_do_list, function () {
  let clickedBtn = $(this);
  $(clickedBtn).closest("li").remove();
});

let delete_course = ".subSection .deleteContainer button";
$(document).on("click", delete_course, function () {
  let clickedBtn = $(this);
  let item_id = $(clickedBtn).attr("id");
  let user_pin = prompt(
    "Enter pin to delete item, this action cannot be reversed"
  );
  $.ajax({
    method: "POST",
    url: "/verify_employee_pin",
    data: { pin_value: user_pin },
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        alert(body.err_message);
        alert("Successfully deleted item");
        if ($(clickedBtn).hasClass("delete_course")) {
          $.ajax({
            method: "POST",
            url: `/employees/courses/${item_id}/action/delete`,
            success: function (body) {
              window.location.href = "/employees/courses";
            },
          });
        }
        if ($(clickedBtn).hasClass("delete_lesson")) {
          let course_id = $(".course_id").attr("id");
          $.ajax({
            method: "POST",
            url: `/employees/lesson/${item_id}/action/delete`,
            success: function (body) {
              window.location.href = `/employees/course/${course_id}/view`;
            },
          });
        }
        if ($(clickedBtn).hasClass("delete_slide")) {
          let course_id = $(".course_id").attr("id");
          let lesson_id = $(".lesson_id").attr("id");
          $.ajax({
            method: "POST",
            url: `/employees/slide/${item_id}/action/delete`,
            success: function (body) {
              window.location.href = `/employees/course/${course_id}/lesson/${lesson_id}/view`;
            },
          });
        }
      }
    },
  });
});

let change_select =
  "#blogsAndNews .employee_subsection .add_new_nb_container form select#gallery_type";
$(document).on("change", change_select, function (e) {
  let clicked_item = $(this);
  let clicked_item_val = $(clicked_item).val();
  let inputs_container = $(clicked_item)
    .closest("form")
    .find(".gallery_selection_inputs");
  $(inputs_container).find("input").removeClass("display_none");
  if (clicked_item_val === "image") {
    $(inputs_container)
      .find("#gallery_selection_video")
      .addClass("display_none");
  }
  if (clicked_item_val === "video") {
    $(inputs_container)
      .find("#gallery_selection_image")
      .addClass("display_none");
  }
});

let add_to_list = "#blogsAndNews .other_links .other_links_container button";
$(document).on("click", add_to_list, function (e) {
  e.preventDefault();
  $("#blogsAndNews .other_links .error_message").html("");
  let clickedBtn = $(this);
  let link_title_input = $("#nb_other_links_title").val();
  let link_input = $("#nb_other_links_anchor").val();
  console.log("gg");
  if (
    ("" + link_title_input).trim().replace(" ", "").length > 0 &&
    ("" + link_input).trim().replace(" ", "").length > 0
  ) {
    console.log("tapinda");
    let li_exists = $(".other_links .other_links_lists li").length > 0;
    let input_value = $(clickedBtn)
      .closest(".other_links_container")
      .find("input#nb_other_links_title")
      .val();
    let input_value_link = $(clickedBtn)
      .closest(".other_links_container")
      .find("input#nb_other_links_anchor")
      .val();
    if (li_exists) {
      let container_html = $(clickedBtn)
        .closest(".other_links")
        .find(".other_links_lists")
        .html();
      $(clickedBtn)
        .closest(".other_links")
        .find(".other_links_lists")
        .html(
          container_html +
            `<li>
                          <span class="limittoone"><a href='${input_value_link}'>${input_value}</a></span>
                          <button class='delete_link'>delete</button>
                       </li>`
        );
    } else {
      $(clickedBtn).closest(".other_links").find(".other_links_lists")
        .html(`<li>
                          <span class="limittoone"><a href='${input_value_link}'>${input_value}</a></span>
                          <button class='delete_link'>delete</button>
                       </li>`);
    }
    $(clickedBtn).closest(".other_links_container").find("input").val("");
  } else {
    $("#blogsAndNews .other_links .error_message").html(
      `<span>Fill all inputs </span>`
    );
    $("#nb_other_links_title").focus();
  }
});

$(document).on("submit", "#new_nb_form", function (e) {
  e.preventDefault();
  $("#blogsAndNews .error_message").html("");
  let form_element = $(this);
  let nb_type = $(form_element).find("#nb_type").val();
  let nb_title = $(form_element).find("#nb_title").val();
  let nb_gallery_type = $(form_element).find("#gallery_type").val();
  let nb_body = $(form_element).find("#nb_body").val();
  let nb_gallery_link;
  nb_gallery_link =
    nb_gallery_type === "image"
      ? $(form_element).find("#gallery_selection_image").val()
      : $(form_element).find("#gallery_selection_video").val();
  let other_links_li = $(form_element).find(".other_links_lists li");
  let link_title_input = $("#nb_other_links_title").val();
  let link_input = $("#nb_other_links_anchor").val();

  if (
    ("" + link_title_input).trim().replace(" ", "").length === 0 &&
    ("" + link_input).trim().replace(" ", "").length === 0
  ) {
    let sendArr = [];
    other_links_li.each(function (e, item_element) {
      let html_content = $(item_element).find("a").html();
      let link_tag = $(item_element).find("a").attr("href");
      console.log(html_content);
      console.log(link_tag);
      sendArr.push({ html_content: html_content, link_tag: link_tag });
    });
    let gallery_type_input_filled = $(
      "#blogsAndNews .employee_subsection .add_new_nb_container form select#gallery_type"
    ).val();
    let gallery_inputs = true;
    let data_body = {
      nb_type: nb_type,
      nb_title: ("" + nb_title).trim(),
      nb_gallery_link: nb_gallery_link,
      nb_gallery_type: nb_gallery_type,
      nb_body: nb_body,
      nb_links: sendArr,
    };
    if (
      gallery_type_input_filled === "image" &&
      ("" + $("#gallery_selection_image").val()).trim().length === 0
    ) {
      $("#gallery_selection_image").focus();
      $("#gallery_selection_image")
        .closest(".gallery_selection_inputs")
        .find(".gallery_selection_error_div")
        .html(`<p>Fill this input</p>`);
      gallery_inputs = false;
    } else if (
      gallery_type_input_filled === "video" &&
      ("" + $("#gallery_selection_video").val()).trim().length === 0
    ) {
      $("#gallery_selection_video").focus();
      $("#gallery_selection_video")
        .closest(".gallery_selection_inputs")
        .find(".gallery_selection_error_div")
        .html(`<p>Fill this input</p>`);
      gallery_inputs = false;
    }
    if (gallery_inputs) {
      console.log(gallery_type_input_filled);
      $.ajax({
        method: "POST",
        url: "/employees/newsAndBlogs/newItem",
        data: data_body,
        success: function (body) {
          if (body.err_status === 401) {
            $("#main_error_message_div").html(`<p>${body.err_message}</p>`);
            $("#main_error_message_div").attr(
              "class",
              "error_message red_zone"
            );
          }
          if (body.err_status === 200) {
            $("#blogsAndNews input").val("");
            $("#blogsAndNews textarea").val("");
            $("#main_error_message_div").html(`<p>${body.err_message}</p>`);
            $("#main_error_message_div").attr(
              "class",
              "error_message success_zone"
            );
            setTimeout(() => {
              $("#main_error_message_div").html(`<p>redirecting ...</p>`);
              window.location.href = `/employees/newsAndBlogs`;
            }, 600);
          }
        },
      });
    }
  } else {
    $("#blogsAndNews .other_links .error_message").html(
      `<span>Add item firstly to submit </span>`
    );
  }
});

let select_nb_tags = "#blogsAndNews .mini_nav_option button";
$(document).on("click", select_nb_tags, function () {
  let clickedBtn = $(this);
  $(select_nb_tags).removeClass("focused_button");
  let tab_id = $(clickedBtn).attr("id").replace("_docs", "");
  $(clickedBtn).addClass("focused_button");
  $.ajax({
    method: "POST",
    url: `/employees/newsAndBlogs/tab/${tab_id}`,
    success: function (body) {
      $(".container_lists").html(`${body.htmlFile}`);
    },
  });
});

let delete_link = "#blogsAndNews .other_links_lists li button.delete_link";
$(document).on("click", delete_link, function (e) {
  e.preventDefault();
  let clickedBtn = $(this);
  $(clickedBtn).closest("li").remove();
});

let delete_item_nb =
  "#blogsAndNews .employee_subsection .container_lists .created_by .btns_container button#delete_item";
$(document).on("click", delete_item_nb, function (e) {
  e.preventDefault();
  let clicked_btn = $(this);
  let pin = prompt("Enter pin to delete document");
  let tab_id = $("#blogsAndNews .mini_nav_option button.focused_button")
    .attr("id")
    .replace("_docs", "");
  console.log(pin);
  let document_id = $(clicked_btn).closest(".bn_lists_container").attr("id");
  $.ajax({
    method: "POST",
    url: `/employees/newsAndBlogs/delete_nb/${document_id}`,
    data: { pin: ~~pin, tab_id: tab_id },
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        console.log(body);
        alert("Successfully deleted document");
        $(".container_lists").html(`${body.htmlFile}`);
      }
    },
  });
});

let edit_nb_document =
  "#blogsAndNews .employee_subsection .add_new_nb_container form#edit_nb_form";
$(document).on("submit", edit_nb_document, function (e) {
  e.preventDefault();
  $("#blogsAndNews .error_message").html("");
  let form_element = $(this);
  let nb_type = $(form_element).find("#nb_type").val();
  let nb_title = $(form_element).find("#nb_title").val();
  let nb_gallery_type = $(form_element).find("#gallery_type").val();
  let nb_body = $(form_element).find("#nb_body").val();
  let nb_gallery_link;
  nb_gallery_link =
    nb_gallery_type === "image"
      ? $(form_element).find("#gallery_selection_image").val()
      : $(form_element).find("#gallery_selection_video").val();
  let other_links_li = $(form_element).find(".other_links_lists li");
  let link_title_input = $("#nb_other_links_title").val();
  let link_input = $("#nb_other_links_anchor").val();

  if (
    ("" + link_title_input).trim().replace(" ", "").length === 0 &&
    ("" + link_input).trim().replace(" ", "").length === 0
  ) {
    let sendArr = [];
    other_links_li.each(function (e, item_element) {
      let html_content = $(item_element).find("a").html();
      let link_tag = $(item_element).find("a").attr("href");
      console.log(html_content);
      console.log(link_tag);
      sendArr.push({ html_content: html_content, link_tag: link_tag });
    });
    let gallery_type_input_filled = $(
      "#blogsAndNews .employee_subsection .add_new_nb_container form select#gallery_type"
    ).val();
    let gallery_inputs = true;
    let data_body = {
      nb_type: nb_type,
      nb_title: ("" + nb_title).trim(),
      nb_gallery_link: nb_gallery_link,
      nb_gallery_type: nb_gallery_type,
      nb_body: nb_body,
      nb_links: sendArr,
    };
    if (
      gallery_type_input_filled === "image" &&
      ("" + $("#gallery_selection_image").val()).trim().length === 0
    ) {
      $("#gallery_selection_image").focus();
      $("#gallery_selection_image")
        .closest(".gallery_selection_inputs")
        .find(".gallery_selection_error_div")
        .html(`<p>Fill this input</p>`);
      gallery_inputs = false;
    } else if (
      gallery_type_input_filled === "video" &&
      ("" + $("#gallery_selection_video").val()).trim().length === 0
    ) {
      $("#gallery_selection_video").focus();
      $("#gallery_selection_video")
        .closest(".gallery_selection_inputs")
        .find(".gallery_selection_error_div")
        .html(`<p>Fill this input</p>`);
      gallery_inputs = false;
    }
    if (gallery_inputs) {
      let doc_id = $("#blogsAndNews .employee_subsection").attr("id");
      $.ajax({
        method: "POST",
        url: `/employees/newsAndBlogs/editItem/${doc_id}`,
        data: data_body,
        success: function (body) {
          if (body.err_status === 401) {
            $("#main_error_message_div").html(`<p>${body.err_message}</p>`);
            $("#main_error_message_div").attr(
              "class",
              "error_message red_zone"
            );
          }
          if (body.err_status === 200) {
            $("#blogsAndNews input").val("");
            $("#blogsAndNews textarea").val("");
            $("#main_error_message_div").html(`<p>${body.err_message}</p>`);
            $("#main_error_message_div").attr(
              "class",
              "error_message success_zone"
            );
            setTimeout(() => {
              $("#main_error_message_div").html(`<p>redirecting ...</p>`);
              window.location.href = `/employees/newsAndBlogs`;
            }, 600);
          }
        },
      });
    }
  } else {
    $("#blogsAndNews .other_links .error_message").html(
      `<span>Add item firstly to submit </span>`
    );
  }
});

let edit_and_save_premium_courses =
  "#premiumCoursesSection .add_courses_container #edit_and_save";

$(document).on("click", edit_and_save_premium_courses, function () {
  let user_pin = prompt(
    "Enter pin to delete item, this action cannot be reversed"
  );
  $.ajax({
    method: "POST",
    url: "/verify_employee_pin",
    data: { pin_value: user_pin },
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        let lessons_lists_input =
          "#premiumCoursesSection .premium_courses li.courses_list .lessons_list input:checked";
        let arr_checked = [];
        $(lessons_lists_input).each(function (e, i) {
          let checked_id = $(i).closest(".lessons_list").attr("id");
          arr_checked.push(checked_id);
        });
        $.ajax({
          method: "POST",
          url: "/employees/premium_courses/checked_items",
          data: { data: arr_checked },
          success: function (body) {
            console.log(body);
            if (body.err_status === 401) {
              alert(body.err_message);
            }
            if (body.err_status === 200) {
              $(".premium_courses").html(`${body.htmlFile}`);
              alert(body.err_message);
            }
          },
        });
      }
    },
  });
});

let add_p_course_form = "#p_course_section #add_p_course_form";
$(document).on("submit", add_p_course_form, function (e) {
  e.preventDefault();
  let formElem = $(this);
  let p_course_title = $(formElem).find("#p_course_title").val();
  let p_course_amount = $(formElem).find("#p_course_amount").val();
  let p_course_period = $(formElem).find("#p_course_period").val();

  if (p_course_amount && p_course_title && p_course_period) {
    let objectSend = {
      p_course_amount: p_course_amount,
      p_course_period: p_course_period,
      p_course_title: p_course_title,
    };
    console.log(objectSend);
    $.ajax({
      method: "POST",
      url: "/employees/premium_courses/add_item",
      data: objectSend,
      success: function (body) {
        console.log(body);
        if (body.err_status === 401) {
          $(formElem)
            .find("#main_error_message_div")
            .html(`<p>${body.err_message}</p>`);
        } else {
          if (body.err_status === 200) {
            $(formElem).find("input").val("");
            $(formElem)
              .find("#main_error_message_div")
              .html(`<p class='positive_feedback'>${body.err_message}</p>`);
            setTimeout(() => {
              $(formElem)
                .find("#main_error_message_div")
                .html(`<p class='positive_feedback'>Redirecting</p>`);
              setTimeout(() => {
                window.location.href = "/employees/premium_courses";
              }, 1100);
            }, 1100);
          }
        }
      },
    });
  }
});

let edit_p_course_form = "#p_course_section #edit_p_course_form";
$(document).on("submit", edit_p_course_form, function (e) {
  e.preventDefault();
  let formElem = $(this);
  let p_course_title = $(formElem).find("#p_course_title").val();
  let p_course_amount = $(formElem).find("#p_course_amount").val();
  let p_course_period = $(formElem).find("#p_course_period").val();
  let p_course_id = $(formElem).attr("p_course_id");
  console.log(p_course_id);
  if (p_course_amount && p_course_title && p_course_period && p_course_id) {
    let objectSend = {
      p_course_amount: p_course_amount,
      p_course_period: p_course_period,
      p_course_title: p_course_title,
    };
    console.log(objectSend);
    $.ajax({
      method: "POST",
      url: `/employees/premium_courses/edit_p_course/${p_course_id}`,
      data: objectSend,
      success: function (body) {
        console.log(body);
        if (body.err_status === 401) {
          $(formElem)
            .find("#main_error_message_div")
            .html(`<p>${body.err_message}</p>`);
        } else {
          if (body.err_status === 200) {
            $(formElem).find("input").val("");
            $(formElem)
              .find("#main_error_message_div")
              .html(`<p class='positive_feedback'>${body.err_message}</p>`);
            setTimeout(() => {
              $(formElem)
                .find("#main_error_message_div")
                .html(`<p class='positive_feedback'>Redirecting</p>`);
              setTimeout(() => {
                window.location.href = "/employees/premium_courses";
              }, 1100);
            }, 1100);
          }
        }
      },
    });
  }
});

let delete_p_course_btn = "#p_course_section #delete_p_course_btn";
$(document).on("click", delete_p_course_btn, function () {
  let clicked_btn = $(this);
  let p_course_id = $(clicked_btn).closest(".delete_btn_container").attr("id");
  let user_pin = prompt(
    "Enter pin to delete item, this action cannot be reversed"
  );
  $.ajax({
    method: "POST",
    url: "/verify_employee_pin",
    data: { pin_value: user_pin },
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        alert(body.err_message);
        $.ajax({
          method: "POST",
          url: `/employees/premium_courses/delete_p_course/${p_course_id}`,
          success: function (body) {
            alert(body.err_message);
            window.location.href = "/employees/premium_courses";
          },
        });
      }
    },
  });
});
