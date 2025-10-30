let curr_month_element = "#calander .curr_month";
let chevron_icons = "#calander .chevron_icons span";
let date_lists_container = "#calander .date_lists";

let currentDate = new Date();
let months_list = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let curr_year = currentDate.getFullYear();
let curr_month = currentDate.getMonth();
let curr_date = currentDate.getDate();

//
function load_Event(day, month, year) {
  $.ajax({
    method: "POST",
    url: "/load_calander_events",
    data: { day: day, month: month, year: year },
    success: function (body) {
      $(".calander_detail").html(`${body.htmlFile}`);
      if ($("#navbarSection").length > 0) {
        $(".calander_div .calander_detail .btns_container").remove();
      }
    },
  });
}
//
function load_prv_curr_nxt_events(day, month, year) {
  $.ajax({
    method: "POST",
    url: "/load_prv_curr_nxt_events",
    data: { curr_day: day, curr_month: month, curr_year: year },
    success: function (body) {
      console.log(body);
      body.prv_month_events.forEach(function (e_prv_month, e) {
        $(`.prvDay${e_prv_month.event_calander_day}`).addClass("has_event");
      });
      body.curr_month_events.forEach(function (e_curr_month, e) {
        $(`.currDay${e_curr_month.event_calander_day}`).addClass("has_event");
      });
      body.nxt_month_events.forEach(function (e_nxt_month, e) {
        $(`.nxtDay${e_nxt_month.event_calander_day}`).addClass("has_event");
      });
      $(".has_event").find(".addEvent").removeClass("inactive");
    },
  });
}

function current_Calander() {
  let lastDateOfMonth = new Date(curr_year, curr_month + 1, 0).getDate();
  let firstDayOfMonth = new Date(curr_year, curr_month, 1).getDay(); // getting first day of month
  let lastDateOfLastMonth = new Date(curr_year, curr_month, 0).getDate(); // last day of previous month
  let lastDayOfMonth = new Date(
    curr_year,
    curr_month,
    lastDateOfMonth
  ).getDay(); // last day of month
  $(".days_lists").html(`<ul class="days_lists">
      <li>Sun</li>
      <li>Mon</li>
      <li>Tue</li>
      <li>Wed</li>
      <li>Thur</li>
      <li>Fri</li>
      <li>Sat</li>
    </ul>`);
  $(curr_month_element).html(
    ` <select class='calander_months' id='calander_months'>
    </select>
     <select class='calander_year' id='calander_year'>
    </select>
    `
  );
  let html_option = ``;
  months_list.forEach(function (list, e) {
    html_option += `<option value='${e}' ${
      curr_month === e ? "selected" : ""
    }>${list}</option>`;
  });
  $(curr_month_element).find(".calander_months").html(html_option);

  let html_option_year = "";
  for (let i = 2025; i <= 2030; i++) {
    html_option_year += `<option value=${i} ${
      curr_year === i ? "selected" : ""
    }>${i}</option>`;
  }
  $(curr_month_element).find(".calander_year").html(html_option_year);

  $(curr_month_element).attr("year", curr_year);
  $(curr_month_element).attr("month", curr_month + 1);
  let date_lists = "";
  for (let i = firstDayOfMonth; i > 0; i--) {
    date_lists =
      date_lists +
      ` <li class='unfocusedDate prv_month_days prvDay${
        lastDateOfLastMonth - i + 1
      }'><span>${
        lastDateOfLastMonth - i + 1
      }</span><span class='addEvent inactive'></span></li>`;
  }
  for (let i = 1; i < lastDateOfMonth + 1; i++) {
    let isToday =
      i === new Date().getDate() &&
      curr_month === new Date().getMonth() &&
      curr_year === new Date().getFullYear()
        ? `focusedDate currentDay curr_month_days currDay${i}`
        : `curr_month_days currDay${i}`;
    date_lists =
      date_lists +
      `<li class='${isToday}'><span>${i}</span><span class='addEvent inactive'></span></li>`;
  }
  for (let i = lastDayOfMonth; i < 6; i++) {
    date_lists =
      date_lists +
      ` <li class='unfocusedDate nxt_month_days nxtDay${
        i - lastDayOfMonth + 1
      }'><span>${
        i - lastDayOfMonth + 1
      }</span><span class='addEvent inactive'></span></li>`;
  }
  $(date_lists_container).html(date_lists);
  load_Event(curr_date, curr_month, curr_year);
  load_prv_curr_nxt_events(
    ~~$(".focusedDate span").html(),
    ~~$("#calander_months").val(),
    ~~$("#calander_year").val()
  );
}
current_Calander();

$(document).on("click", chevron_icons, function () {
  let clickedBtn = $(this);
  let clickedBtn_id = $(clickedBtn).attr("id");
  clickedBtn_id === "icon_left"
    ? (curr_month = curr_month + 1)
    : (curr_month = curr_month - 1);
  let focusedDay = ~~$(".focusedDate span").html();
  if (curr_month < 0 || curr_month > 11) {
    currentDate = new Date(curr_year, curr_month);
    curr_year = currentDate.getFullYear();
    curr_month = currentDate.getMonth();
  } else {
    currentDate = new Date();
  }
  current_Calander();
  if ($(".currentDay").length === 0) {
    if ($(`.currDay${focusedDay}`).length > 0) {
      $(`.currDay${focusedDay}`).addClass("focusedDate");
    } else {
      $(`.currDay1`).addClass("focusedDate");
    }
  }
  load_Event(
    ~~$(".focusedDate span").html(),
    ~~$("#calander_months").val(),
    ~~$("#calander_year").val()
  );
  load_prv_curr_nxt_events(
    ~~$(".focusedDate span").html(),
    ~~$("#calander_months").val(),
    ~~$("#calander_year").val()
  );
});

let change_event_duration =
  ".add_new_calander_gallery_container .select_event_duration_type #event_duration_type";
$(document).on("change", change_event_duration, function () {
  let selectInput = $(this);
  let input_val = $(selectInput).val();
  console.log(input_val);
  if (input_val === "all_day") {
    $(selectInput)
      .closest(".calander_event_duration")
      .find(".time_duration_div")
      .addClass("hidden_div");
  }
  if (input_val === "select_time") {
    $(selectInput)
      .closest(".calander_event_duration")
      .find(".time_duration_div")
      .removeClass("hidden_div");
  }
});

let click_date = "#calander .date_lists li.curr_month_days";
$(document).on("click", click_date, function () {
  let clickedBtn = $(this);
  $(".focusedDate").removeClass("focusedDate");
  $(clickedBtn).closest("li").addClass("focusedDate");
  curr_month = ~~$("#calander_months").val();
  curr_year = ~~$("#calander_year").val();
  load_Event(~~$(".focusedDate span").html(), curr_month, curr_year);
  load_prv_curr_nxt_events(
    ~~$(".focusedDate span").html(),
    curr_month,
    curr_year
  );
});

let click_prv = "#calander .date_lists li.prv_month_days span";
$(document).on("click", click_prv, function () {
  let clickedBtn = $(this);
  let day_focus = ~~$(clickedBtn).html();
  curr_month = curr_month - 1;
  if (curr_month < 0 || curr_month > 11) {
    currentDate = new Date(curr_year, curr_month);
    curr_year = currentDate.getFullYear();
    curr_month = currentDate.getMonth();
  } else {
    currentDate = new Date();
  }
  current_Calander();
  curr_month = ~~$("#calander_months").val();
  curr_year = ~~$("#calander_year").val();
  $(`.currDay${day_focus}`).click();
});

let click_nxt = "#calander .date_lists li.nxt_month_days span";
$(document).on("click", click_nxt, function () {
  let clickedBtn = $(this);
  let day_focus = ~~$(clickedBtn).html();
  curr_month = curr_month + 1;
  if (curr_month < 0 || curr_month > 11) {
    currentDate = new Date(curr_year, curr_month);
    curr_year = currentDate.getFullYear();
    curr_month = currentDate.getMonth();
  } else {
    currentDate = new Date();
  }
  current_Calander();
  $(`.currDay${day_focus}`).click();
});

let change_select_month_year = "#calander .calander_top_nav select";
$(document).on("change", change_select_month_year, function () {
  let selectInput = $(this);
  let focusedDay = ~~$(".focusedDate span").html();
  if ($(selectInput).hasClass("calander_months")) {
    curr_month = ~~$(selectInput).val();
    curr_year = ~~$("#calander_year").val();
    current_Calander();
    if ($(".currentDay").length === 0) {
      if ($(`.currDay${focusedDay}`).length > 0) {
        $(`.currDay${focusedDay}`).addClass("focusedDate");
      } else {
        $(`.currDay1`).addClass("focusedDate");
      }
    }
  } else {
    if ($(selectInput).hasClass("calander_year")) {
      let focusedDay = ~~$(".focusedDate span").html();
      curr_year = ~~$(selectInput).val();
      curr_month = ~~$("#calander_months").val();
      current_Calander();
      if ($(".currentDay").length === 0) {
        if ($(`.currDay${focusedDay}`).length > 0) {
          $(`.currDay${focusedDay}`).addClass("focusedDate");
        } else {
          $(`.currDay1`).addClass("focusedDate");
        }
      }
    }
  }
  // curr_month = ~~$("#calander_months").val();
  // curr_year = ~~$("#calander_year").val();
  load_Event(~~$(".focusedDate span").html(), curr_month, curr_year);
  load_prv_curr_nxt_events(
    ~~$(".focusedDate span").html(),
    curr_month,
    curr_year
  );
});

let new_event_btn = ".calander_div .calander_detail .btns_container #add_event";
$(document).on("click", new_event_btn, function (e) {
  e.preventDefault();
  let focusedDay = ~~$(".focusedDate span").html();
  $(".absolutePage").removeClass("disabled");
  $(
    ".absolutePage .subSection"
  ).html(`<div class="add_new_calander_gallery_container">
        <h3>Event For ${focusedDay} ${months_list[curr_month]}, ${curr_year}</h3>
        <form
          action="/employees/calander_gallery/new_item"
          id="upload_calander_gallery"
        >
          <select name="event_gallery_type" id="event_gallery_type">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input type='' id='focused_day' name='focused_day' style='display:none' value='${focusedDay}'/>
          <input type='' id='focused_month' name='focused_month' style='display:none' value='${curr_month}'/>
          <input type='' id='focused_year' name='focused_year' style='display:none' value='${curr_year}'/>
          <div class="event_gallery_url">
            <input
              type="text"
              name="event_gallery_url"
              id="event_gallery_url"
              placeholder="Event gallery url ..."
              required
            />

            <div class="calander_gallery_url_error_div error_message"></div>
          </div>
          <div class="event_explanation">
            <input
              type="text"
              name="event_explanation"
              id="event_explanation"
              placeholder="Event explanation ..."
            />

            <div class="event_explanation_error_div error_message"></div>
          </div>
          <div class="calander_event_duration">
            <div class="select_event_duration_type">
              <span>Duration :</span>
              <select name="event_duration_type" id="event_duration_type">
                <option value="all_day">All Day</option>
                <option value="select_time">Select Time</option>
              </select>
            </div>
            <div class="start_time_duration time_duration_div hidden_div">
              <span class="start_time"> Start Time </span>
              <select name="event_start_time" id="event_start_time">
                <option value="00">00</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
                <option value="5">05</option>
                <option value="6">06</option>
                <option value="7">07</option>
                <option value="8">08</option>
                <option value="9">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
              </select>
              <select
                name="event_start_time_minutes"
                id="event_start_time_minutes"
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="59">59</option>
                <option value="60">60</option>
              </select>
            </div>
            <div class="end_time_duration time_duration_div hidden_div">
              <span class="end_time"> End Time </span>
              <select name="event_end_time" id="event_end_time">
                <option value="00">00</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
                <option value="5">05</option>
                <option value="6">06</option>
                <option value="7">07</option>
                <option value="8">08</option>
                <option value="9">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
              </select>
              <select name="event_end_time_minutes" id="event_end_time_minutes">
                 <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>
          <div class="error_message" id="main_error_message_div"></div>
          <div id="submit_btn_container">
            <button>upload</button>
          </div>
        </form>
      </div>`);
});

let new_event_form = "form#upload_calander_gallery";
$(document).on("submit", new_event_form, function (e) {
  e.preventDefault();
  let formElement = $(this);
  let event_gallery_type = $(formElement).find("#event_gallery_type").val();
  let event_gallery_url = $(formElement).find("#event_gallery_url").val();
  let event_explanation = $(formElement).find("#event_explanation").val();
  let event_duration_type = $(formElement).find("#event_duration_type").val();
  let event_start_time = $(formElement).find("#event_start_time").val();
  let event_start_time_minutes = $(formElement)
    .find("#event_start_time_minutes")
    .val();
  let event_end_time = $(formElement).find("#event_end_time").val();
  let event_end_time_minutes = $(formElement)
    .find("#event_end_time_minutes")
    .val();
  let event_calander_day = $(formElement).find("#focused_day").val();
  let event_calander_month = $(formElement).find("#focused_month").val();
  let event_calander_year = $(formElement).find("#focused_year").val();
  let whats_on_your_mind;
  if (event_duration_type === "all_day") {
    whats_on_your_mind = true;
  } else {
    if (~~event_start_time === ~~event_end_time) {
      if (~~event_end_time_minutes > ~~event_start_time_minutes) {
        whats_on_your_mind = true;
      }
    } else {
      if (~~event_start_time < ~~event_end_time) {
        whats_on_your_mind = true;
      }
    }
  }
  $("#main_error_message_div").html("");
  if (whats_on_your_mind) {
    let formData = {
      event_gallery_type: event_gallery_type,
      event_gallery_url: event_gallery_url,
      event_explanation: event_explanation,
      event_duration_type: event_duration_type,
      event_start_time: event_start_time,
      event_start_time_minutes: event_start_time_minutes,
      event_end_time: event_end_time,
      event_end_time_minutes: event_end_time_minutes,
      event_calander_year: ~~event_calander_year,
      event_calander_month: ~~event_calander_month,
      event_calander_day: ~~event_calander_day,
    };

    $.ajax({
      method: "POST",
      url: "/employees/event_gallery/new_item",
      data: formData,
      success: function (body) {
        if (body.err_status === 401) {
          alert(body.err_message);
        } else {
          if (body.err_status == 200) {
            $(".absolutePage").addClass("disabled");
            $(".absolutePage .subSection").html("");
            alert(body.err_message);
            curr_month = ~~event_calander_month;
            curr_year = ~~event_calander_year;
            curr_date = ~~event_calander_day;
            $(`.currDay${event_calander_day}`).click();
            $(".focusedDate").removeClass("focusedDate");
            $(`.currDay${event_calander_day}`).addClass("focusedDate");
          }
        }
      },
    });
  } else {
    $("#main_error_message_div").html(
      `<p>Error in setting time, correct your event time and upload again</p>`
    );
  }
});

let edit_event_btn =
  ".calander_div .calander_detail .events_list_container .event_list #edit_event_btn";
$(document).on("click", edit_event_btn, function (e) {
  let clickedBtn = $(this);
  let event_id = $(clickedBtn).closest(".event_list").attr("id");
  $.ajax({
    method: "POST",
    url: `/employees/calander/edit_event/${event_id}`,
    success: function (body) {
      if (body.err_status === 401) {
        alert(body.err_message);
      } else {
        $(".absolutePage").removeClass("disabled");
        $(".absolutePage .subSection").html(`${body.htmlFile}`);
      }
    },
  });
});

let edit_eventForm = "form#edit_calander_event";
$(document).on("submit", edit_eventForm, function (e) {
  e.preventDefault();
  let formElement = $(this);
  let event_id = $(".add_new_calander_gallery_container").attr("id");
  let event_gallery_type = $(formElement).find("#event_gallery_type").val();
  let event_gallery_url = $(formElement).find("#event_gallery_url").val();
  let event_explanation = $(formElement).find("#event_explanation").val();
  let event_duration_type = $(formElement).find("#event_duration_type").val();
  let event_start_time = $(formElement).find("#event_start_time").val();
  let event_start_time_minutes = $(formElement)
    .find("#event_start_time_minutes")
    .val();
  let event_end_time = $(formElement).find("#event_end_time").val();
  let event_end_time_minutes = $(formElement)
    .find("#event_end_time_minutes")
    .val();
  let event_calander_day = $(formElement).find("#focused_day").val();
  let event_calander_month = $(formElement).find("#focused_month").val();
  let event_calander_year = $(formElement).find("#focused_year").val();
  let whats_on_your_mind;
  if (event_duration_type === "all_day") {
    whats_on_your_mind = true;
  } else {
    if (~~event_start_time === ~~event_end_time) {
      if (~~event_end_time_minutes > ~~event_start_time_minutes) {
        whats_on_your_mind = true;
      }
    } else {
      if (~~event_start_time < ~~event_end_time) {
        whats_on_your_mind = true;
      }
    }
  }
  $("#main_error_message_div").html("");
  if (whats_on_your_mind) {
    let formData = {
      event_gallery_type: event_gallery_type,
      event_gallery_url: event_gallery_url,
      event_explanation: event_explanation,
      event_duration_type: event_duration_type,
      event_start_time: event_start_time,
      event_start_time_minutes: event_start_time_minutes,
      event_end_time: event_end_time,
      event_end_time_minutes: event_end_time_minutes,
      event_calander_year: ~~event_calander_year,
      event_calander_month: ~~event_calander_month,
      event_calander_day: ~~event_calander_day,
    };

    $.ajax({
      method: "POST",
      url: `/employees/event_gallery/edit_event_item/${event_id}`,
      data: formData,
      success: function (body) {
        if (body.err_status === 401) {
          alert(body.err_message);
        } else {
          if (body.err_status == 200) {
            $(".absolutePage").addClass("disabled");
            $(".absolutePage .subSection").html("");
            alert(body.err_message);
            curr_month = ~~event_calander_month;
            curr_year = ~~event_calander_year;
            curr_date = ~~event_calander_day;
            $(`.currDay${event_calander_day}`).click();
            $(".focusedDate").removeClass("focusedDate");
            $(`.currDay${event_calander_day}`).addClass("focusedDate");
          }
        }
      },
    });
  } else {
    $("#main_error_message_div").html(
      `<p>Error in setting time, correct your event time and upload again</p>`
    );
  }
});

let deleteEvent = ".add_new_calander_gallery_container #delete_event";
$(document).on("click", deleteEvent, function () {
  let event_id = $(".add_new_calander_gallery_container").attr("id");
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
          url: `/employees/event_gallery/delete_event_item/${event_id}`,
          success: function (body) {
            if (body.err_status === 401) {
              alert(body.err_message);
            } else {
              $(".absolutePage").addClass("disabled");
              $(".absolutePage .subSection").html("");
              alert(body.err_message);
              let day_focus = ~~$(".focusedDate span").html();
              $(`.currDay${day_focus}`).click();
            }
          },
        });
      }
    },
  });
});
