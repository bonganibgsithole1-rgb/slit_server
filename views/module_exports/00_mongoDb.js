let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

// FILES DOCUMENTS

// COURSE
let coursesSchema = new mongoose.Schema({
  section_created: { type: Date, default: Date.now() },
  course_title: String,
  course_body: String,
  course_number: Number,
});
let Course = mongoose.model("course", coursesSchema);

// LESSON --
let lessonSchema = new mongoose.Schema({
  lesson_created: { type: Date, default: Date.now() },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  lesson_title: String,
  lesson_body: String,
  lesson_number: Number,
  lesson_image_url: String,
  lesson_is_premium: { type: Boolean, defualt: false },
});
let Lesson = mongoose.model("lesson", lessonSchema);

// SLIDE
let slideSchema = new mongoose.Schema({
  slide_created: { type: Date, default: Date.now() },
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "lesson" },
  slide_number: Number,
  slide_type: String,
  slide_type_url: String,
  slide_content_type: String,
  slide_content_title: String,
  slide_to_do_list_arr: Array,
  slide_body: String,
});
let Slide = mongoose.model("slide", slideSchema);

// USER SCHEMA

let UserSchema = new mongoose.Schema({
  profile_created: { type: Date, default: Date.now },
  profile_name: String,
  profile_email: String,
  profile_password: String,
  profile_age: Number,
  communication_prefarence: String,
});

//authenticate input ---

UserSchema.statics.authenticate = async function (email, password, callback) {
  try {
    const user = await User.findOne({ profile_email: email }).exec();

    if (!user) {
      const err = new Error("User not found.");
      err.status = 401;
      throw err;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.profile_password
    );

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    return callback(null, user);
  } catch (error) {
    return callback();
  }
};

// hashing password
UserSchema.pre("save", function (next) {
  let user = this;
  bcrypt.hash(user.profile_password, 10, function (err, hash) {
    if (err) {
      return next(err);
    } else {
      user.profile_password = hash;
      next();
    }
  });
});
let User = mongoose.model("users", UserSchema);

// employee schema

let EmployeeSchema = new mongoose.Schema({
  employee_created: { type: Date, default: Date.now },
  employee_name: String,
  employee_email: String,
  employee_password: String,
  employee_pin: String,
  employee_dob: Date,
  employee_active: { type: Boolean, default: false },
  employee_role: Number,
  employee_activated_by: Number,
  employee_verification_code: String,
  manage_employees: { type: Boolean, default: false },
  manage_gallery: { type: Boolean, default: false },
  manage_appointments: { type: Boolean, default: false },
  manage_newsandblogs: { type: Boolean, default: false },
  manage_calander: { type: Boolean, default: false },
  manage_courses: { type: Boolean, default: false },
});
// employee schema

EmployeeSchema.statics.authenticate = async function (
  email,
  password,
  callback
) {
  try {
    const employee = await Employee.findOne({ employee_email: email }).exec();

    if (!employee) {
      const err = new Error("User not found.");
      err.status = 401;
      throw err;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      employee.employee_password
    );

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    return callback(null, employee);
  } catch (error) {
    return callback();
  }
};

EmployeeSchema.statics.authenticate2 = async function (email, pin, callback) {
  try {
    const employee = await Employee.findOne({ employee_email: email }).exec();
    if (!employee) {
      const err = new Error("User not found.");
      err.status = 401;
      throw err;
    }
    const isValidPin = await bcrypt.compare(`${pin}`, employee.employee_pin);
    if (!isValidPin) {
      throw new Error("Invalid pin");
    }
    return callback(null, employee);
  } catch (error) {
    return callback();
  }
};

// hashing password
EmployeeSchema.pre("save", function (next) {
  let employee = this;
  bcrypt.hash(employee.employee_password, 10, function (err, hash) {
    if (err) {
      return next(err);
    } else {
      bcrypt.hash(`${employee.employee_pin}`, 10, function (err2, hash2) {
        if (err2) {
          return next(err2);
        } else {
          employee.employee_password = hash;
          employee.employee_pin = hash2;
          next();
        }
      });
    }
  });
});

let Employee = mongoose.model("employees", EmployeeSchema);

// services
let ServicesSchema = new mongoose.Schema({
  service_name: String,
  service_body: String,
  service_nos: Number,
});
let Services = mongoose.model("services", ServicesSchema);

// services
let NewsAndBLogsSchema = new mongoose.Schema({
  nb_created: { type: Date, default: Date.now },
  nb_type: String,
  nb_title: String,
  nb_gallery_link: String,
  nb_gallery_type: String,
  nb_body: String,
  nb_links: Array,
  nb_creator: String,
});
let NewsAndBLogs = mongoose.model("newAndBlogs", NewsAndBLogsSchema);

// services
let GallerySchema = new mongoose.Schema({
  gallery_uploaded: { type: Date, default: Date.now },
  gallery_type: String,
  gallery_url: String,
  gallery_explanation: String,
  gallery_uploader: String,
});
let Gallery = mongoose.model("gallery", GallerySchema);

//events
let EventsSchema = new mongoose.Schema({
  event_uploaded: { type: Date, default: Date.now },
  event_gallery_type: String,
  event_calander_year: Number,
  event_calander_month: Number,
  event_calander_day: Number,
  event_gallery_url: String,
  event_explanation: String,
  event_duration_type: String,
  event_start_time: String,
  event_end_time: String,
  event_start_time_minutes: String,
  event_end_time_minutes: String,
  user_creator: String,
});
let Events = mongoose.model("calander_event", EventsSchema);

let BookingsSchema = new mongoose.Schema({
  booking_data: { type: Date, default: Date.now },
  booking_company_name: String,
  booking_contact_number: String,
  booking_email_address: String,
  booking_request_date: String,
  booking_request_time: String,
  booking_language_to_use: String,
  booking_other_language: String,
  booking_interpretation_type: String,
  booking_status: { type: String, default: "Pending" },
  booking_processed_by: String,
  booking_summary: String,
});

let Booking = mongoose.model("booking", BookingsSchema);

//
//Premium course
let PremiumCourseSchema = new mongoose.Schema({
  p_course_added: { type: Date, default: Date.now },
  p_course_title: String,
  p_course_amount: Number,
  p_course_period: String,
});
let PremiumCourse = mongoose.model("premium_course", PremiumCourseSchema);

module.exports = {
  Booking,
  User,
  Gallery,
  Course,
  Lesson,
  Slide,
  Services,
  Employee,
  NewsAndBLogs,
  PremiumCourse,
  Events,
};
