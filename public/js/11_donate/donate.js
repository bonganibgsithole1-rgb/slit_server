// CHOOSECARD TYPE
let donation_method_type_checkBox =
  "#donateSection .row .cell .donationMethods .donationMethodDivCont .input_check .checkbox_inputCont";
let donation_method_type_clickCard =
  "#donateSection .row .cell .donationMethods .donationMethodDivCont .clickSvg";
function donationMethodChoice(a) {
  $(document).on("click", a, function () {
    let clickedBtn = $(this);
    let isCheckedCard = ("" + $(clickedBtn).attr("class")).includes(
      "checkedBox"
    );
    $(
      "#donateSection .row .cell .donationMethods .donationMethodDivCont .input_check .checkbox_inputCont"
    ).attr("class", "checkbox_inputCont");
    $(
      "#donateSection .row .cell .donationMethods .donationMethodDivCont .clickSvg"
    ).attr("class", "clickSvg");
    $(clickedBtn)
      .closest(".donationMethods")
      .find("input")
      .attr("checked", false);
    $(clickedBtn)
      .closest(".donationMethodDivCont")
      .find(".checkbox_inputCont")
      .attr("class", "checkbox_inputCont checkedBox");
    $(clickedBtn)
      .closest(".donationMethodDivCont")
      .find(".clickSvg")
      .attr("class", "clickSvg svg_checked");
    $(clickedBtn).find("input").attr("checked", true);
  });
}
donationMethodChoice(donation_method_type_checkBox);
donationMethodChoice(donation_method_type_clickCard);

// CHOOSE OR HIDE DONATION AMOUNT
let showOrHideDonationAmount = "#donateSection .row .cell .moreInputInfo span";
function hideOrShowAMountFunct(a) {
  $(document).on("click", a, function () {
    let clickedBtn = $(this);
    let isDonationAmountChecked = (
      "" + $(clickedBtn).closest(".moreInputInfo").attr("class")
    ).includes("checkDonationAmount");
    if (!isDonationAmountChecked) {
      $(clickedBtn)
        .closest(".moreInputInfo")
        .attr("class", "moreInputInfo checkDonationAmount");
      $(clickedBtn)
        .closest(".moreInputInfo")
        .find("#hideOrShowDonationAmount_par span")
        .html(
          `<svg viewBox="0 0 512 512"><path d="M480 128c0 8.188-3.125 16.38-9.375 22.62l-256 256C208.4 412.9 200.2 416 192 416s-16.38-3.125-22.62-9.375l-128-128C35.13 272.4 32 264.2 32 256c0-18.28 14.95-32 32-32c8.188 0 16.38 3.125 22.62 9.375L192 338.8l233.4-233.4C431.6 99.13 439.8 96 448 96C465.1 96 480 109.7 480 128z"/></svg>`
        );
      $(clickedBtn)
        .closest("#hideOrShowDonationAmount_par")
        .find("input")
        .attr("checked", true);
    } else {
      $(clickedBtn).closest(".moreInputInfo").attr("class", "moreInputInfo");
      $(clickedBtn)
        .closest(".moreInputInfo")
        .find("#hideOrShowDonationAmount_par span")
        .html("");
      $(clickedBtn)
        .closest("#hideOrShowDonationAmount_par")
        .find("input")
        .attr("checked", false);
    }
  });
}
hideOrShowAMountFunct(showOrHideDonationAmount);

// DISPLAY OR DO NOT DISPLAY MY NAME
let dispayNameOrNot_checkBox =
  "#donateSection .cell .select_display_type li .input_represent";
let dispayNameOrNot_label =
  "#donateSection .cell .select_display_type li label";
function displayOrHideName(a) {
  $(document).on("click", a, function () {
    let clickedBtn = $(this);
    $(
      "#donateSection .cell .select_display_type li .input_represent.checked_input"
    ).attr("class", "input_represent");
    $(clickedBtn)
      .closest("#select_display_type")
      .find("input")
      .attr("checked", false);
    $(clickedBtn)
      .closest("li")
      .find(".input_represent")
      .attr("class", "input_represent checked_input");
    $(clickedBtn).find("input").attr("checked", true);
  });
}
displayOrHideName(dispayNameOrNot_checkBox);
displayOrHideName(dispayNameOrNot_label);

// DONATION INFORMATION

let donationForm = "#donateSection #submitDonationInformation";
$(document).on("submit", donationForm, function (e) {
  e.preventDefault();
  let formElement = $(this);
  let donation_frequency = $(formElement).find("#donation_frequency").val();
  let donation_amount = $(formElement).find("#donation_amount").val();
  let hide_or_show_donation_amount = $(formElement)
    .find("#hideOrShowDonationAmount")
    .attr("checked");
  let donation_comment = $(formElement).find("#comment_donate_input").val();
  let donation_method = $(formElement)
    .find(".input_check .checkbox_inputCont.checkedBox")
    .closest(" .donationMethodDivCont")
    .attr("id");
  let rec_first_name = $(formElement).find("#first_name_rec").val();
  let rec_last_name = $(formElement).find("#last_name_rec").val();
  let rec_email = $(formElement).find("#email_rec").val();
  let nameOnPage = $(formElement)
    .find("li .input_represent.checked_input")
    .closest("li")
    .attr("id");
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
                      addErrAndErrMessage(
                        "#profile_email",
                        errObject.errMessage
                      );
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
  if (donation_amount.length > 0) {
    console.log("fsdfasd");
  }
  let send_Information = {
    donation_frequency: donation_frequency,
    donation_amount: donation_amount,
    hide_or_show_donation_amount: hide_or_show_donation_amount,
    donation_comment: donation_comment,
    donation_method: donation_method,
    rec_first_name: rec_first_name,
    rec_last_name: rec_last_name,
    rec_email: rec_email,
    nameOnPage: nameOnPage,
  };
  console.log(send_Information);
});
