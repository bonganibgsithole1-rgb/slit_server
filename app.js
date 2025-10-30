let methodoverride = require("method-override"),
  express_sanitizer = require("express-sanitizer"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  session = require("express-session"),
  express = require("express");
let log = require("node-file-logger");
let MongoStore = require("connect-mongo");
let fs = require("fs");
let app = express();
let cookieParser = require("cookie-parser");
let ejsRender = require("../Slit server/views/module_exports/02_ejsRender");

// MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/slit_Server", {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
mongoose.connection.on("disconnected", () => {
  console.log("MONGODB disconnected. Reconnecting ...");
  mongoose.connect("mongodb://127.0.0.1:27017/slit_Server").then(() => {
    console.log("database reconnected");
  });
});
let db = mongoose.connection;
mongoose.set("strictQuery", true);
//mongo error
db.on("error", log.Info.bind(console, "connection failed"));

// SESSION SET UP
app.use(
  session({
    secret: "Slit Server",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongooseConnection: db,
      mongoUrl: "mongodb://127.0.0.1:27017/slit_Server",
      collections: "sessions",
    }),
  })
);

// SCHEMAS
let schemas = require("./views/module_exports/00_mongoDb");
const { error, Console } = require("console");
let User = schemas.User;
let Courses = schemas.Course;
let Lessons = schemas.Lesson;
let Slides = schemas.Slide;
let Employees = schemas.Employee;
let NewsAndBLogs = schemas.NewsAndBLogs;
let Gallery = schemas.Gallery;
let Events = schemas.Events;
let PremiumCourses = schemas.PremiumCourse;
let Booking = schemas.Booking;

// MAKE USER ID AVAILABLE IN TEMPLATES in *templates* meaning ejs templates not js.

app.use(bodyParser.urlencoded({ extended: true }));

// save static files from /public
app.use(express.static(__dirname + "/public"));

// view engine set up
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// express sanitizer and method overide setup
app.use(express_sanitizer());
app.use(methodoverride("_method"));

app.use(express.static("public"));
app.set("view engine", "ejs");

// MAKE USER ID AVAILABLE IN TEMPLATES in *templates* meaning ejs templates not js.
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongooseConnection: db,
      mongoUrl: "mongodb://0.0.0.0:27017/slit_Server",
      collections: "sessions",
    }),
    cookie: {
      maxAge: 4 * 60 * 60 * 1000, // 4 hours
    },
  })
);

//MIDDLEWARE
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.profile = req.session.profile;
  next();
});

// ROUTES

app.get("/", function (req, res) {
  Employees.findOne({
    employee_email: "slitorg@gmail.com",
    employee_name: "Slit org",
  }).then(function (foundEmployee) {
    function loadejs() {
      NewsAndBLogs.find({})
        .sort({ nb_created: -1 })
        .limit(3)
        .then(function (nbs) {
          NewsAndBLogs.find({}).then(function (all_nbs) {
            res.render("pages/01_index.ejs", {
              title: "HOME",
              nbs: nbs,
              all_nbs: all_nbs,
            });
          });
        });
    }
    if (foundEmployee) {
      loadejs();
    } else {
      Employees.create({
        employee_name: "Slit org",
        employee_email: "slitorg@gmail.com",
        employee_password: "slit123454321tils",
        employee_pin: 1178,
        employee_active: true,
        manage_employees: true,
        manage_gallery: true,
        manage_appointments: true,
        manage_newsandblogs: true,
        manage_calander: true,
        manage_courses: true,
      })
        .then(function (createdEmployee) {
          loadejs();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});
app.post("/news_and_blogs/change_phase/:phase_id", function (req, res) {
  let phase_id = req.params.phase_id;

  NewsAndBLogs.find({})
    .sort({ nb_created: -1 })
    .skip(phase_id === "first_phase" ? 0 : 3)
    .limit(3)
    .then(function (nbs) {
      if (nbs) {
        ejsRender("ejsRenders/04_change_nb_phase.ejs", {
          nbs: nbs,
        }).then(function (htmlFile) {
          res.send({
            err_status: 200,
            htmlFile: htmlFile,
          });
        });
      } else {
        res.send({ err_message: "Error loading information", err_status: 401 });
      }
    });
});
app.post("/blogsAndNews/change_tab_home/:tab_name", function (req, res) {
  let tab_name = req.params.tab_name;
  if (tab_name !== "all") {
    NewsAndBLogs.find({ nb_type: tab_name })
      .limit(3)
      .sort({ nb_created: -1 })
      .then(function (foundNb) {
        if (foundNb) {
          ejsRender("ejsRenders/05_nb_home.ejs", {
            nbs: foundNb,
          }).then((htmlFile) => {
            return res.send({
              err_status: 200,
              htmlFile: htmlFile,
            });
          });
        } else {
          res.send({
            err_message: "Error loading information",
            err_status: 401,
          });
        }
      });
  } else {
    NewsAndBLogs.find({})
      .limit(3)
      .sort({ nb_created: -1 })
      .then(function (foundNb) {
        if (foundNb) {
          ejsRender("ejsRenders/05_nb_home.ejs", {
            nbs: foundNb,
          }).then((htmlFile) => {
            return res.send({
              err_status: 200,
              htmlFile: htmlFile,
            });
          });
        } else {
          res.send({
            err_message: "Error loading information",
            err_status: 401,
          });
        }
      });
  }
});
app.post("/blogsAndNews/retrieve_blog/:blog_id", function (req, res) {
  let blog_id = req.params.blog_id;
  NewsAndBLogs.findOne({ _id: blog_id }).then(function (foundBlog) {
    if (foundBlog) {
      ejsRender("ejsRenders/07_view_one_blog.ejs", {
        nb: foundBlog,
      }).then((htmlFile) => {
        return res.send({
          err_status: 200,
          htmlFile: htmlFile,
        });
      });
    } else {
      res.send({ err_status: 401, err_message: "Error finding document" });
    }
  });
});
app.get("/signIn", function (req, res) {
  let currentUser = res.locals.currentUser;
  if (currentUser) {
    res.redirect("/");
  } else {
    res.render("pages/signing/00_signIn.ejs", {
      title: "SIGN IN",
      user_id: currentUser,
    });
  }
});
app.post("/signIn", function (req, res) {
  let body = req.body;
  let confirmInformation = {
    profile_email: body.prof_email,
    profile_password: body.prof_password,
  };
  User.findOne({ profile_email: confirmInformation.profile_email })
    .then((validEmail) => {
      if (!validEmail) {
        console.log("fsdfsd");
        res.send({
          errBox: [
            {
              profile_id: "#profile_email",
              errMessage: "Email does not exist",
            },
          ],
          status: 401,
        });
      } else {
        if (validEmail) {
          User.authenticate(
            confirmInformation.profile_email,
            confirmInformation.profile_password,
            function (err, user) {
              if (err || !user) {
                return res.send({
                  errBox: [
                    {
                      profile_id: "#profile_password",
                      errMessage:
                        "Provided password does not match email adress",
                    },
                  ],
                  status: 401,
                });
              } else {
                req.session.userId = user._id;
                req.session.profile = user;
                req.session.save((err) => {
                  if (err) {
                    console.log("hello how are you douing");
                    console.log(err);
                  }
                  return res.send({
                    status: 200,
                    errMessage: "Successfully logged In",
                  });
                });
              }
            }
          );
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({
        errBox: [
          {
            profile_id: "#profile_email",
            errMessage: "Email does not exist",
          },
        ],
        status: 401,
      });
    });
});
app.get("/signUp", function (req, res) {
  let currentUser = res.locals.currentUser;
  console.log(currentUser);
  if (currentUser) {
    res.redirect("/");
  } else {
    res.render("pages/signing/01_signUp.ejs", {
      title: "SIGN UP",
      user_id: currentUser,
    });
  }
});
app.post("/signUp", function (req, res) {
  let body = req.body;
  let signUpInfo = {
    profile_name: body.prof_name,
    profile_email: body.prof_email,
    profile_password: body.prof_password,
    profile_age: body.prof_age,
    communication_type: body.communication_type,
  };
  User.findOne({ profile_email: body.prof_email })
    .then((data) => {
      if (data) {
        res.send({
          err_status: 401,
          errMessage: `Profile with the same email already exists`,
        });
      } else {
        User.create(signUpInfo).then((data) => {
          req.session.userId = data._id;
          req.session.profile = data;
          req.session.save((err) => {
            if (err) {
              res.send({
                err_status: 401,
                errMessage:
                  "There is a problem creating the account, contact technical support for help",
                alert: true,
              });
            }
            res.send({
              errMessage: "Successfully created account",
              err_status: 200,
            });
          });
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/board", function (req, res) {
  res.render("pages/02_board.ejs", { title: "BOARD" });
});
app.get("/donate", function (req, res) {
  res.render("pages/03_donate.ejs", { title: "DONATE" });
});
app.post("/getService", function (req, res) {
  schemas.Services.findOne({ service_name: req.body.service_name })
    .then((data) => {
      console.log(data);
      if (data) {
        res.send({
          errStatus: 200,
          data_id: data._id,
          data: data.service_name,
          data_body: data.service_body,
        });
      } else {
        schemas.Services.insertMany(req.body)
          .then((data) => {
            console.log("working");
            res.send({
              errStatus: 200,
              data_id: data._id,
              data: data.service_name,
              data_body: data.service_body,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/serviceBody", function (req, res) {
  let body = req.body.service_body;
  let service_id = req.body.service_id;
  schemas.Services.findByIdAndUpdate(
    { _id: service_id },
    { service_body: body }
  )
    .then((data) => {
      console.log(data);
      res.send({
        errStatus: 200,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.post("/book_an_interpreter", function (req, res) {
  let formData = req.body;
  Booking.create(formData).then(function (createdBooking) {
    if (createdBooking) {
      res.send({
        err_status: 200,
        err_message: "Successfully booked your appointment",
      });
    } else {
      res.send({
        err_status: 401,
        err_message: "Booking not created check for errors",
      });
    }
  });
});

app.post("/employees/manage_booking/:booking_id", function (req, res) {
  let booking_id = req.params.booking_id;
  let employee_details = req.session.employee;
  let manage_summary = req.body.show_summary;
  let language_lists = ["English", "Shona", "Ndebele"];
  let booking_interpretations = [
    "Interpretation",
    "Phone",
    "Document Transalation",
  ];
  Booking.findById({ _id: booking_id }).then(function (booking) {
    console.log(manage_summary);
    console.log(booking);
    if (booking) {
      ejsRender("/partials/employees/ejsRenders/05_edit_booking.ejs", {
        booking: booking,
        employee_details: employee_details,
        booking_interpretations: booking_interpretations,
        language_lists: language_lists,
        manage_summary: manage_summary,
      }).then(function (htmlFile) {
        res.send({
          err_status: 200,
          htmlFile: htmlFile,
        });
      });
    } else {
      res.send({ err_message: "Item not found", err_status: 401 });
    }
  });
});

app.post("/employees/add_summary/:booking_id", function (req, res) {
  let booking_id = req.params.booking_id;
  let booking_summary = req.body.booking_summary;
  console.log(booking_summary);
  Booking.findByIdAndUpdate(
    { _id: booking_id },
    { booking_summary: booking_summary, booking_status: "Processed" }
  ).then(function (updatedBooking) {
    if (updatedBooking) {
      res.send({
        err_message: "Booking processed successfully",
        err_status: 200,
      });
    } else {
      res.send({ err_message: "Error processing booking", err_status: 401 });
    }
  });
});
app.get("/communication", function (req, res) {
  res.render("pages/06_communication.ejs", { title: "COMMUNICATION" });
});
app.get("/interpreters", function (req, res) {
  res.render("pages/07_interpreters.ejs", { title: "INTERPRETERS" });
});
app.get("/services", function (req, res) {
  res.render("pages/08_services.ejs", { title: "SERVICES" });
});
app.get("/buy_course", function (req, res) {
  let url_next = req.query.url;
  console.log(url_next);
  let lesson_id = req.query.lesson_id;
  console.log(lesson_id);
  res.render("pages/13_buy_course.ejs", {
    title: "SERVICES",
    lesson_id: lesson_id,
    url_next: url_next,
  });
});
app.get("/courses", function (req, res) {
  Courses.find({})
    .sort({ course_number: 1 })
    .then(function (courses) {
      Lessons.find({})
        .sort({ lesson_number: 1 })
        .then(function (lessons) {
          PremiumCourses.find({}).then(function (p_courses) {
            console.log(p_courses);
            res.render("pages/04_courses.ejs", {
              title: "COURSES",
              courses: courses,
              lessons: lessons,
              p_courses: p_courses,
            });
          });
        });
    });
});
app.post("/courses/check_syllabus", function (req, res) {
  Courses.find({})
    .sort({ course_number: 1 })
    .then(function (courses) {
      Lessons.find({})
        .sort({ lesson_number: 1 })
        .then(function (lessons) {
          Slides.find({})
            .sort({ slide_number: 1 })
            .then(function (slides) {
              console.log(courses);
              ejsRender("/ejsRenders/02_syllabus.ejs", {
                slides: slides,
                lessons: lessons,
                courses: courses,
              }).then(function (htmlFile) {
                res.send({
                  err_status: 200,
                  htmlFile: htmlFile,
                });
              });
            });
        });
    });
});
app.get(
  "/courses/:course_id/lesson/:lesson_id/viewLesson",
  function (req, res) {
    let course_id = req.params.course_id;
    let lesson_id = req.params.lesson_id;
    let user_details = req.session.profile;
    console.log(user_details);
    Courses.findOne({ _id: course_id })
      .then(function (course) {
        Lessons.findOne({ _id: lesson_id })
          .then(function (lesson) {
            PremiumCourses.find({}).then(function (p_courses) {
              function load_slide() {
                Slides.find({ lesson_id: lesson_id })
                  .sort({ slide_number: 1 })
                  .then(function (slides) {
                    res.render("pages/05_lessons.ejs", {
                      slides: slides,
                      slide: slides[0],
                      lesson: lesson,
                      course: course,
                      Slide: req.params.slide,
                      title: `${lesson.lesson_title}`,
                    });
                  });
              }
              if (lesson.lesson_is_premium && p_courses.length > 0) {
                ejsRender("/ejsRenders/06_buy_course.ejs", {
                  user_details: user_details,
                  p_courses: p_courses,
                  lesson: lesson,
                }).then(function (htmlFile) {
                  res.send({
                    err_status: 401,
                    htmlFile: htmlFile,
                  });
                });
              } else {
                load_slide();
              }
            });
          })
          .catch((error) => res.send("Error loading lesson"));
      })
      .catch((error) => res.send("Error loading course"));
  }
);
app.post("/get_lesson_details/:lesson_id", function (req, res) {
  let lesson_id = req.params.lesson_id;
  Lessons.findById({ _id: lesson_id }).then(function (lesson) {
    PremiumCourses.find({}).then(function (p_courses) {
      if (lesson) {
        ejsRender("/ejsRenders/06_buy_course.ejs", {
          user_details: true,
          lesson: lesson,
          p_courses: p_courses,
        }).then(function (htmlFile) {
          res.send({
            err_status: 200,
            htmlFile: htmlFile,
          });
        });
      } else {
        res.send({ err_message: "Error finding lesson", err_status: 401 });
      }
    });
  });
});
app.get(
  "/courses/:course_id/lesson/:lesson_id/slide/:slide_id",
  function (req, res) {
    let course_id = req.params.course_id;
    let lesson_id = req.params.lesson_id;
    let slide_id = req.params.slide_id;
    console.log(slide_id);
    Courses.findOne({ _id: course_id }).then(function (course) {
      Lessons.findOne({ _id: lesson_id }).then(function (lesson) {
        Slides.find({ lesson_id: "" + lesson_id })
          .sort({ slide_number: 1 })
          .then(function (slides) {
            console.log(slides);
            Slides.findOne({ _id: "" + slide_id }).then(function (slide) {
              //
              res.render("pages/05_lessons.ejs", {
                slides: slides,
                slide: slide,
                lesson: lesson,
                course: course,
                Slide: undefined,
                title: `${lesson.lesson_title}`,
              });
            });
          });
      });
    });
  }
);

app.post(
  "/sliding_arrows/lesson/:lesson_id/slide/:slide_id/:binary_direct",
  function (req, res) {
    let lesson_id = req.params.lesson_id;
    let slide_id = req.params.slide_id;
    let next_position = Number(req.params.binary_direct);

    Lessons.findOne({ _id: lesson_id })
      .then(function (foundLesson) {
        if (foundLesson) {
          Slides.find({ lesson_id: lesson_id })
            .sort({ slide_number: 1 })
            .then(function (foundSlides) {
              Slides.findOne({ _id: slide_id }).then(function (foundSlide) {
                let slides_id_arr = [];
                foundSlides.forEach(function (a) {
                  slides_id_arr.push(`${a._id}`);
                });
                let slide_position = slides_id_arr.indexOf(`${foundSlide._id}`);
                let slide_next_position = ~~slide_position + next_position;
                slide_next_position =
                  slide_next_position === foundSlides.length
                    ? 0
                    : slide_next_position;
                slide_next_position =
                  slide_next_position < 0
                    ? ~~foundSlides.length - 1
                    : slide_next_position;
                let slide = foundSlides[slide_next_position];
                ejsRender("/ejsRenders/00_next_or_prev_slide.ejs", {
                  slide: slide,
                  lesson: foundLesson,
                }).then(function (htmlFile) {
                  ejsRender("/ejsRenders/01_reload_slide_progress_bar.ejs", {
                    slide: slide,
                    slides: foundSlides,
                  }).then(function (htmlFile2) {
                    res.send({
                      err_status: 200,
                      curr_slide_id: slide._id,
                      htmlFile: htmlFile,
                      htmlFile2: htmlFile2,
                    });
                  });
                });
              });
            });
        } else {
          res.send({ err_status: 401, err_message: "Lesson not found" });
        }
      })
      .catch((error) => {
        res.send({ err_status: 401, err_message: error.errMessage });
      });
  }
);
app.get("/liveChat", function (req, res) {
  res.render("pages/09_liveChart.ejs", { title: "LIVE CHART" });
});
app.get("/community", function (req, res) {
  let user_active = req.session.employeeId;
  Gallery.find({ gallery_type: "image" }).then(function (gallery_images) {
    Gallery.find({ gallery_type: "video" }).then(function (gallery_videos) {
      res.render("pages/10_community.ejs", {
        title: "COMMUNITY",
        user_active: user_active,
        gallery_images: gallery_images,
        gallery_videos: gallery_videos,
      });
    });
  });
});
app.get("/comments", function (req, res) {
  res.render("pages/11_comments.ejs", { title: "COMMENTS" });
});
app.get("/blogsAndNews", function (req, res) {
  NewsAndBLogs.find({})
    .sort({ nb_created: -1 })
    .then(function (nbs) {
      res.render("pages/12_blogsAndNews.ejs", {
        title: "Blogs and news",
        nbs: nbs,
      });
    });
});
app.post("/blogsAndNews/change_tab/:tab_name", function (req, res) {
  let tab_name = req.params.tab_name;
  if (tab_name !== "all") {
    NewsAndBLogs.find({ nb_type: tab_name }).then(function (foundNb) {
      if (foundNb) {
        ejsRender("ejsRenders/03_news_and_blogs.ejs", {
          nbs: foundNb,
        }).then((htmlFile) => {
          return res.send({
            err_status: 200,
            htmlFile: htmlFile,
          });
        });
      } else {
        res.send({ err_message: "Error loading information", err_status: 401 });
      }
    });
  } else {
    NewsAndBLogs.find({}).then(function (foundNb) {
      if (foundNb) {
        ejsRender("ejsRenders/03_news_and_blogs.ejs", {
          nbs: foundNb,
        }).then((htmlFile) => {
          return res.send({
            err_status: 200,
            htmlFile: htmlFile,
          });
        });
      } else {
        res.send({
          err_message: "Error loading information",
          err_status: 401,
        });
      }
    });
  }
});

app.post("/verify_employee_pin", function (req, res) {
  let employee_details = req.session.employee;
  let pin_value = req.body.pin_value;
  if (employee_details) {
    Employees.authenticate2(
      employee_details.employee_email,
      ~~pin_value,
      function (err, employee) {
        if (err || !employee) {
          return res.send({
            err_message: "Provided pin does not match your account",
            err_status: 401,
          });
        } else {
          res.send({ err_message: "Pin verified", err_status: 200 });
        }
      }
    );
  } else {
    res.send({ err_message: "You are logged out", err_status: 401 });
  }
});
app.get("/employees/signUp", function (req, res) {
  let employee_id = req.session.employeeId;
  if (employee_id) {
    res.redirect("/employees/home");
  } else {
    res.render("pages/signing/employee/01_signUp_employee.ejs", {
      title: "EMPLOYEES",
    });
  }
});
app.post("/sign_in/employee", function (req, res) {
  let confirmInformation = req.body;
  console.log(confirmInformation);
  Employees.authenticate(
    confirmInformation.employee_email,
    confirmInformation.employee_password,
    function (err, employee) {
      console.log(employee);
      if (err || !employee) {
        return res.send({
          errMessage: "Provided password does not match email adress",
          status: 401,
        });
      } else {
        if (!employee.employee_active) {
          return res.send({
            errMessage: `Your account has not yet been approved by your administrator, code is ${employee.employee_verification_code}`,
            status: 401,
          });
        } else {
          req.session.employeeId = employee._id;
          req.session.employee = employee;
          req.session.save((err) => {
            if (err) {
              console.log(err);
            }
            return res.send({
              status: 200,
              errMessage: "Successfully logged In",
            });
          });
        }
      }
    }
  );
});
app.get("/employees/signIn", function (req, res) {
  let employee_id = req.session.employeeId;
  if (employee_id) {
    res.redirect("/employees/home");
  } else {
    res.render("pages/signing/employee/00_employee.ejs", {
      title: "EMPLOYEES",
    });
  }
});
app.post("/sign_up/employee", function (req, res) {
  let body = req.body;
  Employees.findOne({
    employee_email: body.employee_email,
  }).then((match) => {
    console.log(match);
    if (match) {
      res.send({
        err_status: 401,
        err_message: "Employee using the same email address exists",
      });
    } else {
      Employees.create(body).then((data) => {
        res.send({
          err_status: 200,
          err_message:
            "<span class='success_message'>Successfully created your account, wait for administrator to verify your account then</span> <a href='/employees/signIn'>Sign In</a>",
        });
      });
    }
  });
});
app.get("/employees/bookings", function (req, res) {
  let employee_id = req.session.employeeId;
  let employee_details = req.session.employee;
  Booking.find({}).then(function (bookings) {
    if (employee_id) {
      res.render("pages/employees/10_booking.ejs", {
        title: "EMPLOYEES",
        employee_details: employee_details,
        bookings: bookings,
      });
    } else {
      res.redirect("/employees/signIn");
    }
  });
});

app.get("/employees/home", function (req, res) {
  let employee_id = req.session.employeeId;
  let employee_details = req.session.employee;
  Booking.find({ booking_status: "Pending" }).then(function (bookings) {
    Booking.find({}).then(function (all_bookings) {
      if (employee_id) {
        res.render("pages/employees/00_home.ejs", {
          title: "EMPLOYEES",
          employee_details: employee_details,
          bookings: bookings,
          all_bookings: all_bookings,
        });
      } else {
        res.redirect("/employees/signIn");
      }
    });
  });
});

app.get("/employees/employee_lists", function (req, res) {
  let employee_id = req.session.employeeId;
  let employee_details = req.session.employee;
  if (employee_id) {
    Employees.find({}).then((employees) => {
      res.render("pages/employees/00_employee_lists/00_employee_lists.ejs", {
        title: "EMPLOYEES",
        employees: employees,
        employee_details: employee_details,
      });
    });
  } else {
    res.redirect("/employees/signIn");
  }
});
app.post(
  "/employee/:verify_employee/:employee_id/:veri_code",
  function (req, res) {
    let employee_id = req.params.employee_id;
    let veri_code = req.params.veri_code;

    Employees.findOne({ _id: employee_id })
      .then(function (employee) {
        let employee_det = employee;
        if (req.params.verify_employee === "verify_employee") {
          if (employee) {
            if (employee_det.employee_active) {
              res.send({
                err_status: 401,
                err_message: "Employee exists and is already active",
              });
            } else {
              if (employee_det.employee_verification_code === veri_code) {
                Employees.findByIdAndUpdate(
                  { _id: employee_id },
                  { employee_active: true }
                ).then(function (updatedEmployee) {
                  console.log(updatedEmployee);
                  res.send({
                    err_status: 200,
                    err_message: "Successfully activated Employee",
                  });
                });
              } else {
                res.send({
                  err_status: 401,
                  err_message: "Incorrect verification code",
                });
              }
            }
          } else {
            res.send({
              err_status: 401,
              err_message:
                "Employee does not exist call TECHNICAL SUPPORT FOR HELP",
            });
          }
        }
        if (req.params.verify_employee === "diactivate") {
          if (employee) {
            if (!employee_det.employee_active) {
              res.send({
                err_status: 401,
                err_message: "Employee exists and is already inactive",
              });
            } else {
              Employees.findByIdAndUpdate(
                { _id: employee_id },
                { employee_active: false }
              ).then(function (updatedEmployee) {
                res.send({
                  err_status: 200,
                  err_message: "Successfully deactivated Employee",
                });
              });
            }
          } else {
            res.send({
              err_status: 401,
              err_message:
                "Employee does not exist call TECHNICAL SUPPORT FOR HELP",
            });
          }
        }
      })
      .catch(function (error) {
        res.send({ err_status: 401, err_message: error.message });
      });
  }
);
app.post("/employees/manage_employees/:employee_id", (req, res) => {
  let employee_id = req.params.employee_id;

  Employees.findById({ _id: employee_id })
    .then((employee) => {
      if (employee) {
        console.log(employee);
        ejsRender("partials/employees/ejsRenders/00_manage_employees.ejs", {
          employee: employee,
        }).then((htmlFile) => {
          res.send({ err_status: 200, htmlFile: htmlFile });
        });
      } else {
        res.send({
          err_status: 401,
          err_message: "Employee does not exist in the database",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({ err_status: 401, err_message: error.errMessage });
    });
});

app.post(
  "/employees/manage_employees/edit_employees/:employee_id",
  function (req, res) {
    let employee_id = req.params.employee_id;
    let body = req.body;
    Employees.findByIdAndUpdate({ _id: employee_id }, body)
      .then(function (updated_data) {
        console.log("Successfully updated employee data");
        Employees.findOne({ _id: employee_id })
          .then((employee_data) => {
            ejsRender("partials/employees/ejsRenders/00_manage_employees.ejs", {
              employee: employee_data,
            }).then((htmlFile) => {
              res.send({
                err_status: 200,
                htmlFile: htmlFile,
                err_message: "Successfully editade information",
              });
            });
          })
          .catch((error) => {
            res.send({ err_status: 401, err_message: error.errMessage });
          });
      })
      .catch((error) =>
        res.send({ err_status: 401, err_message: error.errMessage })
      );
  }
);
app.get("/employees/premium_courses", function (req, res) {
  let user_id = req.session.profile;
  Courses.find({}).then(function (courses) {
    Lessons.find({}).then(function (lessons) {
      PremiumCourses.find({}).then(function (p_courses) {
        res.render(
          "pages/employees/06_premium_courses/00_premium_courses.ejs",
          {
            title: "PREMIUM COURSES",
            courses: courses,
            lessons: lessons,
            p_courses: p_courses,
          }
        );
      });
    });
  });
});

app.get("/employees/premium_courses/add_p_course", function (req, res) {
  let user_id = req.session.profile;
  res.render("pages/employees/06_premium_courses/01_add_premium_course.ejs", {
    title: "ADD PREMIUM COURSES",
  });
});

app.get(
  "/employees/premium_courses/edit_p_course/:p_course_id",
  function (req, res) {
    let p_course_id = req.params.p_course_id;
    let user_id = req.session.profile;
    PremiumCourses.findOne({ _id: p_course_id }).then(function (p_course) {
      console.log(p_course);
      if (p_course) {
        res.render(
          "pages/employees/06_premium_courses/02_edit_premium_course.ejs",
          {
            title: "EDIT PREMIUM COURSE",
            p_course: p_course,
          }
        );
      } else {
        res.send("Premium course type no longer exists");
      }
    });
  }
);

app.post(
  "/employees/premium_courses/edit_p_course/:p_course_id",
  function (req, res) {
    let body = req.body;
    PremiumCourses.findById({ _id: req.params.p_course_id }).then(function (
      found_p_course
    ) {
      if (found_p_course) {
        PremiumCourses.findByIdAndUpdate(
          { _id: req.params.p_course_id },
          body
        ).then(function (updated_p_course) {
          res.send({
            err_message: "Successfully updated information",
            err_status: 200,
          });
        });
      } else {
        res.send({
          err_message: "Premium course no longer exists",
          err_status: 401,
        });
      }
    });
  }
);
app.post(
  "/employees/premium_courses/delete_p_course/:p_course_id",
  function (req, res) {
    let id = req.params.p_course_id;
    PremiumCourses.findOne({ _id: id }).then(function (p_course) {
      if (p_course) {
        PremiumCourses.findByIdAndDelete({ _id: id }).then(function (
          deleted_p_course
        ) {
          res.send({
            err_status: 200,
            err_message: "Successfully deleted item",
          });
        });
      } else {
        res.send({
          err_status: 200,
          err_message: "Premium course no longer exists",
        });
      }
    });
  }
);
app.post("/employees/premium_courses/add_item", function (req, res) {
  let body = req.body;
  console.log(body);
  PremiumCourses.findOne({ p_course_title: body.p_course_title }).then(
    function (found_p_course) {
      if (found_p_course) {
        res.send({
          err_status: 401,
          err_message: "Title with same name exists",
        });
      } else {
        PremiumCourses.create(body)
          .then(function (created_courses) {
            res.send({
              err_status: 200,
              err_message: "Successfully created premium course title",
            });
          })
          .catch((err) => {
            res.send({ err_status: 401, err_message: err.error_message });
          });
      }
    }
  );
});

app.post("/employees/premium_courses/checked_items", function (req, res) {
  let premium_courses_arr = req.body.data;
  function produceHtml() {
    Courses.find({})
      .sort({ course_number: 1 })
      .then(function (courses) {
        Lessons.find({})
          .sort({ lesson_number: 1 })
          .then(function (lessons) {
            ejsRender("partials/employees/ejsRenders/06_premium_courses.ejs", {
              lessons: lessons,
              courses: courses,
            }).then((htmlFile) => {
              res.send({
                err_status: 200,
                err_message: "Successfully updated information",
                htmlFile: htmlFile,
              });
            });
          });
      });
  }
  Lessons.updateMany({}, { lesson_is_premium: false }).then(function (
    firstUpdate
  ) {
    if (firstUpdate) {
      if (premium_courses_arr) {
        premium_courses_arr.forEach(function (i) {
          Lessons.findByIdAndUpdate(
            { _id: i },
            { lesson_is_premium: true }
          ).then(function (updatedAll) {
            if (!updatedAll) {
              return res.send({
                err_status: 401,
                err_message: "Err updating information",
              });
            }
          });
        });
        produceHtml();
      } else {
        produceHtml();
      }
    } else {
      res.send({
        err_status: 401,
        err_message: "Err updating information",
      });
    }
  });
});
app.get("/employees/courses", function (req, res) {
  Courses.find({})
    .sort({ course_number: 1 })
    .then(function (courses) {
      res.render("pages/employees/01_courses.ejs", {
        title: "COURSES",
        courses: courses,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/employees/course/newCourse", function (req, res) {
  res.render("pages/employees/02_course_Add.ejs", {
    title: "COURSES",
  });
});
app.post("/employees/courses/addCourse", function (req, res) {
  let courseCreated = req.body;
  Courses.create(courseCreated)
    .then(function (createdCourse) {
      res.redirect("/employees/courses");
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get("/employees/course/:course_id/edit", function (req, res) {
  Courses.findOne({ _id: req.params.course_id }).then(function (course) {
    res.render("pages/employees/07_course_edit.ejs", {
      title: "COURSES",
      course: course,
    });
  });
});
app.post(
  "/employees/courses/:course_id/action/:editOrDelete",
  function (req, res) {
    if (req.params.editOrDelete === "edit") {
      Courses.findByIdAndUpdate({ _id: req.params.course_id }, req.body).then(
        function (edited_cours) {
          res.redirect("/employees/courses");
        }
      );
    }
    if (req.params.editOrDelete === "delete") {
      Lessons.find({ course_id: req.params.course_id }).then(function (
        foundLessons
      ) {
        foundLessons.forEach(function (lesson) {
          Slides.deleteMany({ lesson_id: lesson._id }).then(function (
            deletedSlides
          ) {
            console.log(deletedSlides);
          });
        });

        Lessons.deleteMany({ course_id: req.params.course_id }).then(function (
          deleted_lessons
        ) {
          console.log(deleted_lessons);
          Courses.findByIdAndDelete({ _id: req.params.course_id }).then(
            function (deletedCourse) {
              console.log(deletedCourse);
              console.log("deleted");
              res.send("done");
            }
          );
        });
      });
    }
  }
);
app.get("/employees/course/:course_id/view", function (req, res) {
  let course_id = req.params.course_id;
  Courses.findOne({ _id: course_id })
    .then(function (course) {
      Lessons.find({ course_id: course._id })
        .sort({ lesson_number: 1 })
        .then(function (lessons) {
          res.render("pages/employees/03_lessons.ejs", {
            title: "Lessons",
            course: course,
            lessons: lessons,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});
app.get(
  "/employees/lesson/newLesson/course_id/:course_id",
  function (req, res) {
    res.render("pages/employees/04_lesson_Add.ejs", {
      title: "LESSON",
      course_id: req.params.course_id,
    });
  }
);
app.post(
  "/employees/lesson/addLesson/course_id/:course_id",
  function (req, res) {
    let course_id = req.params.course_id;

    Lessons.create({
      course_id: course_id,
      lesson_title: req.body.lesson_title,
      lesson_body: req.body.lesson_body,
      lesson_number: req.body.lesson_number,
      lesson_image_url: req.body.lesson_image_url,
    })
      .then(function (createdlessons) {
        res.redirect(`/employees/course/${course_id}/view`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
);
app.get(
  "/employees/course/:course_id/lesson/:lesson_id/edit",
  function (req, res) {
    let lesson_id = req.params.lesson_id;
    Lessons.findOne({ _id: lesson_id }).then(function (lesson) {
      console.log(lesson);
      res.render("pages/employees/08_lesson_edit.ejs", {
        title: "LESSON",
        lesson: lesson,
        course_id: req.params.course_id,
      });
    });
  }
);
app.post(
  "/employees/lesson/:lesson_id/action/:editOrDelete",
  function (req, res) {
    let lesson_id = req.params.lesson_id;
    if (req.params.editOrDelete === "edit") {
      Lessons.findByIdAndUpdate({ _id: lesson_id }, req.body).then(function (
        updatedLesson
      ) {
        res.redirect(`/employees/course/${updatedLesson.course_id}/view`);
      });
    }
    if (req.params.editOrDelete === "delete") {
      Slides.deleteMany({ lesson_id: lesson_id }).then(function (
        deleted_slides
      ) {
        console.log(deleted_slides);
        Lessons.deleteOne({ _id: lesson_id }).then(function (deleted_lessons) {
          console.log(deleted_lessons);
          res.send("deleted");
        });
      });
    }
  }
);
app.get(
  "/employees/course/:course_id/lesson/:lesson_id/view",
  function (req, res) {
    let course_id = req.params.course_id;
    let lesson_id = req.params.lesson_id;
    // Slides.deleteMany({}).then(function (deleted) {
    //   console.log(deleted);
    // });
    Courses.findById({ _id: course_id })
      .then(function (course) {
        Lessons.findById({ _id: "" + lesson_id }).then(function (lesson) {
          Slides.find({ lesson_id: "" + lesson_id })
            .sort({ slide_number: 1 })
            .then(function (slides) {
              res.render("pages/employees/05_slides.ejs", {
                title: "SLIDES",
                slides: slides,
                slide: slides[0],
                course: course,
                lesson: lesson,
                course_id: req.params.course_id,
              });
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
);
app.get(
  "/employees/courses/:course_id/lesson/:lesson_id/slide/:slide_id",
  function (req, res) {
    let course_id = req.params.course_id;
    let lesson_id = req.params.lesson_id;
    let slide_id = req.params.slide_id;
    Courses.findOne({ _id: course_id }).then(function (course) {
      Lessons.findOne({ _id: lesson_id }).then(function (lesson) {
        Slides.find({ lesson_id: "" + lesson_id })
          .sort({ slide_number: 1 })
          .then(function (slides) {
            console.log(slides);
            Slides.findOne({ _id: "" + slide_id }).then(function (slide) {
              //
              res.render("pages/employees/05_slides.ejs", {
                title: "SLIDES",
                slides: slides,
                slide: slide,
                course: course,
                lesson: lesson,
                course_id: req.params.course_id,
              });
            });
          });
      });
    });
  }
);
app.get(
  "/employees/course/:course_id/lesson/:lesson_id/newSlide",
  function (req, res) {
    let lesson_id = req.params.lesson_id;
    let course_id = req.params.course_id;
    res.render("pages/employees/06_slide_New.ejs", {
      title: "NEW SLIDES",
      lesson_id: lesson_id,
      course_id: course_id,
    });
  }
);
app.post(
  "/employees/course/:course_id/lesson/:lesson_id/newSlide",
  function (req, res) {
    let course_id = req.params.course_id;
    let lesson_id = req.params.lesson_id;
    let slide_create = req.body;
    slide_create.lesson_id = lesson_id;
    Slides.findOne({
      slide_number: ~~req.body.slide_number,
      lesson_id: lesson_id,
    }).then(function (foundSlide) {
      if (foundSlide) {
        res.send({
          err_message: "Slide with the same number exists",
          err_status: 401,
          err_type: "slide_number",
        });
      } else {
        Slides.create(slide_create)
          .then(function (createdSlide) {
            console.log(createdSlide);
            res.send({
              err_message: "Successfully created slide",
              err_status: 200,
            });
          })
          .catch(function (error) {
            res.send({ err_message: error.errMessage, err_status: 401 });
          });
      }
    });
  }
);

app.get(
  "/employees/lesson/:lesson_id/slide/:slide_id/edit",
  function (req, res) {
    let lesson_id = req.params.lesson_id;
    let slide_id = req.params.slide_id;
    Lessons.findOne({ _id: lesson_id }).then(function (lesson) {
      Slides.findOne({ _id: slide_id }).then(function (slide) {
        res.render("pages/employees/09_slide_edit.ejs", {
          title: "NEW SLIDES",
          lesson_id: lesson_id,
          course_id: lesson.course_id,
          slide: slide,
        });
      });
    });
  }
);

app.post(
  "/employees/slide/:slide_id/action/:editOrDelete",
  function (req, res) {
    let slide_id = req.params.slide_id;
    if (req.params.editOrDelete === "edit") {
      Slides.findByIdAndUpdate({ _id: slide_id }, req.body).then(function (
        updatedSlide
      ) {
        Lessons.findOne({ _id: updatedSlide.lesson_id }).then(function (
          lesson
        ) {
          res.send({
            err_status: 200,
            err_message: `Successfully edited information`,
          });
        });
      });
    }
    if (req.params.editOrDelete === "delete") {
      Slides.deleteOne({ _id: slide_id }).then(function (deleted_slide) {
        console.log(deleted_slide);
        res.send("deleted");
      });
    }
  }
);

// blogs and news employees

app.get("/employees/newsAndBlogs", function (req, res) {
  NewsAndBLogs.find({})
    .sort({ nb_created: -1 })
    .then(function (foundItems) {
      Employees.find({}).then(function (employees) {
        res.render("pages/employees/03_newsAndBlogs/00_newsAndBlogs.ejs", {
          title: "NEW SLIDES",
          foundItems: foundItems,
          employees: employees,
        });
      });
    });
});

app.post("/employees/newsAndBlogs/tab/:tab_id", function (req, res) {
  let tab_id = req.params.tab_id;
  if (tab_id !== "all") {
    NewsAndBLogs.find({ nb_type: tab_id })
      .sort({ nb_created: -1 })
      .then(function (foundItems) {
        Employees.find({}).then(function (employees) {
          ejsRender("partials/employees/ejsRenders/01_blogsAndNews.ejs", {
            foundItems: foundItems,
            employees: employees,
          }).then((htmlFile) => {
            res.send({
              htmlFile: htmlFile,
            });
          });
        });
      });
  } else {
    NewsAndBLogs.find({})
      .sort({ nb_created: -1 })
      .then(function (foundItems) {
        ejsRender("partials/employees/ejsRenders/01_blogsAndNews.ejs", {
          foundItems: foundItems,
        }).then((htmlFile) => {
          res.send({
            htmlFile: htmlFile,
          });
        });
      });
  }
});
app.get("/employees/newsAndBlogs/newItem", function (req, res) {
  res.render("pages/employees/03_newsAndBlogs/01_new_item.ejs", {
    title: "Add New",
  });
});
app.post("/employees/newsAndBlogs/newItem", function (req, res) {
  let edit_data = req.body;
  edit_data.nb_creator = req.session.employee_id;
  NewsAndBLogs.findOne({ nb_title: ("" + req.body.nb_title).trim() }).then(
    function (foundTitle) {
      if (foundTitle) {
        res.send({
          err_message: "Blog with the same title exists",
          err_status: 401,
        });
      } else {
        NewsAndBLogs.create(edit_data).then(function (createdItem) {
          res.send({
            err_message: "Successfully created document",
            err_status: 200,
          });
        });
      }
    }
  );
});
app.get("/employees/newsAndBlogs/edit_nb/:item_id", function (req, res) {
  NewsAndBLogs.findById({ _id: req.params.item_id }).then(function (foundItem) {
    if (foundItem) {
      res.render("pages/employees/03_newsAndBlogs/03_found_doc_item.ejs", {
        title: "Add New",
        foundItem: foundItem,
      });
    } else {
      res.send({
        err_message: "Document does not exist",
        err_status: 401,
      });
    }
  });
});
app.post("/employees/newsAndBlogs/delete_nb/:item_id", function (req, res) {
  let item_id = req.params.item_id;
  let tab_id = req.body.tab_id;
  let pin_value = req.body.pin;
  let employee_details = req.session.employee;

  if (employee_details.manage_newsandblogs) {
    Employees.authenticate2(
      employee_details.employee_email,
      ~~pin_value,
      function (err, employee) {
        if (err || !employee) {
          return res.send({
            err_message: "Provided pin does not match your account",
            err_status: 401,
          });
        } else {
          NewsAndBLogs.findByIdAndDelete({ _id: item_id }).then(function (
            deleted_document
          ) {
            if (tab_id !== "all") {
              NewsAndBLogs.find({ nb_type: tab_id })
                .sort({ nb_created: -1 })
                .then(function (foundItems) {
                  ejsRender(
                    "partials/employees/ejsRenders/01_blogsAndNews.ejs",
                    {
                      foundItems: foundItems,
                    }
                  ).then((htmlFile) => {
                    res.send({
                      htmlFile: htmlFile,
                      err_message: "Successfully deleted document",
                      err_status: 200,
                    });
                  });
                });
            } else {
              NewsAndBLogs.find({})
                .sort({ nb_created: -1 })
                .then(function (foundItems) {
                  ejsRender(
                    "partials/employees/ejsRenders/01_blogsAndNews.ejs",
                    {
                      foundItems: foundItems,
                    }
                  ).then((htmlFile) => {
                    res.send({
                      htmlFile: htmlFile,
                      err_message: "Successfully deleted document",
                      err_status: 200,
                    });
                  });
                });
            }
          });
        }
      }
    );
  } else {
    res.send({
      err_status: 401,
      err_message: "Item could only be deleted by an approved account",
    });
  }
});
app.post("/employees/newsAndBlogs/editItem/:doc_id", function (req, res) {
  let doc_id = req.params.doc_id;
  let edit_data = req.body;
  edit_data.nb_creator = req.session.employee_id;
  NewsAndBLogs.findById({ _id: doc_id }).then(function (found_doc) {
    if (!found_doc) {
      res.send({ err_status: 401, err_message: "Document not found" });
    } else {
      NewsAndBLogs.findByIdAndUpdate({ _id: doc_id }, edit_data).then(function (
        edited_document
      ) {
        res.send({
          err_status: 200,
          err_message: "Successfully edited information",
        });
      });
    }
  });
});
app.get("/employees/gallery", function (req, res) {
  // Gallery.deleteMany({}).then(function () {});
  Gallery.find({ gallery_type: "video" })
    .sort({ gallery_uploaded: -1 })
    .then(function (gallery_video) {
      Gallery.find({ gallery_type: "image" })
        .sort({ gallery_uploaded: -1 })
        .then(function (gallery_img) {
          res.render("pages/employees/04_gallery/00_gallery.ejs", {
            title: "GALLERY",
            gallery_img: gallery_img,
            gallery_video: gallery_video,
          });
        });
    });
});
app.post("/employees/gallery/new_item", function (req, res) {
  let formData = req.body;
  formData.gallery_uploader = req.session.employee_id;
  Gallery.findOne({ gallery_url: formData.gallery_url }).then(function (
    gallery_exists
  ) {
    if (gallery_exists) {
      return res.send({ err_message: "Url already exists", err_status: 401 });
    } else {
      Gallery.create(formData).then(function (createdData) {
        Gallery.find({ gallery_type: createdData.gallery_type }).then(function (
          reloaded_container
        ) {
          ejsRender("partials/employees/ejsRenders/02_gallery_reload.ejs", {
            reloaded_container: reloaded_container,
            gallery_type: createdData.gallery_type,
          }).then((htmlFile) => {
            console.log(createdData);
            return res.send({
              err_message: "Successfully created gallery item",
              err_status: 200,
              createdData: createdData,
              htmlFile: htmlFile,
            });
          });
        });
      });
    }
  });
});
app.post("/employees/gallery/delete_btn/:image_id", function (req, res) {
  let image_id = req.params.image_id;
  Gallery.findOne({ _id: image_id }).then(function (item_exists) {
    if (item_exists) {
      let gallery_type = item_exists.gallery_type;
      Gallery.findByIdAndDelete({ _id: image_id }).then(function (
        deleted_item
      ) {
        Gallery.find({ gallery_type: gallery_type }).then(function (
          reloaded_container
        ) {
          ejsRender("partials/employees/ejsRenders/02_gallery_reload.ejs", {
            reloaded_container: reloaded_container,
            gallery_type: gallery_type,
          }).then((htmlFile) => {
            return res.send({
              err_message: "Successfully deleted item",
              err_status: 200,
              gallery_type: gallery_type,
              htmlFile: htmlFile,
            });
          });
        });
      });
    } else {
      res.send({ err_status: 401, err_message: "Item does not exist" });
    }
  });
});
app.get(
  "/employees/gallery/gallery_information/:gallery_id",
  function (req, res) {
    let gallery_id = req.params.gallery_id;
    Gallery.findById({ _id: gallery_id }).then(function (gallery_info) {
      if (gallery_info) {
        res.send({ err_status: 200, gallery_info: gallery_info });
      } else {
        res.send({ err_status: 401, err_message: "Data not found" });
      }
    });
  }
);
app.post("/employees/gallery/edit_btn/:image_id", function (req, res) {
  let image_id = req.params.image_id;
  let formData = req.body;
  Gallery.findOne({ _id: image_id }).then(function (item_exists) {
    if (item_exists) {
      let gallery_type = item_exists.gallery_type;
      Gallery.findByIdAndUpdate({ _id: image_id }, formData).then(function (
        updated_info
      ) {
        Gallery.find({ gallery_type: gallery_type }).then(function (
          reloaded_container
        ) {
          ejsRender("partials/employees/ejsRenders/02_gallery_reload.ejs", {
            reloaded_container: reloaded_container,
            gallery_type: gallery_type,
          }).then((htmlFile) => {
            return res.send({
              err_message: "Successfully updated item",
              err_status: 200,
              gallery_type: gallery_type,
              htmlFile: htmlFile,
              updated_info: updated_info,
            });
          });
        });
      });
    } else {
      res.send({ err_status: 401, err_message: "Item does not exist" });
    }
  });
});
app.get("/employees/calander", function (req, res) {
  res.render("pages/employees/05_calander/00_calander.ejs", {
    title: "CALANDER",
  });
});

app.post("/employees/event_gallery/new_item", function (req, res) {
  let formData = req.body;
  formData.user_creator = req.session.employee_id;
  Events.create(formData).then(function (createdEvent) {
    if (createdEvent) {
      res.send({ err_status: 200, err_message: "Successfully created event" });
    } else {
      res.send({ err_status: 401, err_message: "Error creating event" });
    }
  });
});
app.post("/load_calander_events", function (req, res) {
  let curr_year = req.body.year;
  let curr_month = req.body.month;
  let curr_day = req.body.day;
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
  Events.find({
    event_calander_year: curr_year,
    event_calander_month: curr_month,
    event_calander_day: curr_day,
  }).then(function (loaded_events) {
    ejsRender("partials/employees/ejsRenders/03_events.ejs", {
      loaded_events: loaded_events,
      curr_year: curr_year,
      curr_month: curr_month,
      curr_day: curr_day,
      months_list: months_list,
    }).then((htmlFile) => {
      res.send({
        htmlFile: htmlFile,
      });
    });
  });
});

app.post("/load_prv_curr_nxt_events", function (req, res) {
  let curr_year = req.body.curr_year;
  let curr_month = req.body.curr_month;
  let initial_curr_month = curr_month;
  Events.find({
    event_calander_year: curr_year,
    event_calander_month: curr_month,
  }).then(function (curr_month_events) {
    curr_month = ~~initial_curr_month + 1;
    if (curr_month > 11) {
      curr_year = curr_year + 1;
      curr_month = 0;
    }
    Events.find({
      event_calander_year: curr_year,
      event_calander_month: curr_month,
    }).then(function (nxt_month_events) {
      curr_month = initial_curr_month - 1;
      if (!(curr_month - 1 >= 0)) {
        curr_year = curr_year - 1;
        curr_month = 12;
      }
      Events.find({
        event_calander_year: curr_year,
        event_calander_month: curr_month,
      }).then(function (prv_month_events) {
        res.send({
          nxt_month_events: nxt_month_events,
          curr_month_events: curr_month_events,
          prv_month_events: prv_month_events,
        });
      });
    });
  });
});

app.post("/employees/calander/edit_event/:event_id", function (req, res) {
  let event_id = req.params.event_id;
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
  Events.findById({ _id: event_id }).then(function (event) {
    if (event) {
      console.log(event);
      ejsRender("partials/employees/ejsRenders/04_edit_event.ejs", {
        event: event,
        months_list: months_list,
      }).then((htmlFile) => {
        res.send({
          htmlFile: htmlFile,
        });
      });
    } else {
      res.send({ err_status: 401, err_message: "Item not found" });
    }
  });
});
app.post(
  "/employees/event_gallery/edit_event_item/:event_id",
  function (req, res) {
    let event_id = req.params.event_id;
    Events.findById({ _id: event_id }).then(function (event) {
      if (event) {
        Events.findByIdAndUpdate({ _id: event_id }, req.body).then(function (
          updated_event
        ) {
          if (updated_event) {
            res.send({
              err_status: 200,
              err_message: "Successfully updated Event",
            });
          } else {
            res.send({ err_status: 401, err_message: "Error updating Event" });
          }
        });
      } else {
        res.send({ err_status: 401, err_message: "Item not found" });
      }
    });
  }
);

app.post(
  "/employees/event_gallery/delete_event_item/:event_id",
  function (req, res) {
    let event_id = req.params.event_id;
    Events.findById({ _id: event_id }).then(function (event) {
      if (event) {
        Events.findByIdAndDelete({ _id: event_id }).then(function (
          deleted_item
        ) {
          res.send({
            err_status: 200,
            err_message: "Successfully deleted event",
          });
        });
      } else {
        res.send({ err_status: 401, err_message: "Item not found" });
      }
    });
  }
);

app.post("/employee/logOut", (req, res) => {
  req.session.employeeId = null;
  req.session.employee = null;
  res.send({ err_status: 200, errMessage: "Successfully logged out" });
});
app.post("/signOut", function (req, res) {
  let user_id = req.session.profile;
  if (user_id) {
    User.findOne({ _id: user_id })
      .then(function (data) {
        if (!data) {
          res.send("/");
        } else {
          req.session.userId = false;
          req.session.profile = false;
          res.locals.currentUser = false;
          res.send("/");
        }
      })
      .catch(function (error) {
        console.log(error);
        req.session.userId = {};
        req.session.profile = false;
        res.locals.currentUser = false;
        res.send("/");
      });
  } else {
    console.log(error);
    req.session.userId = {};
    req.session.profile = false;
    res.locals.currentUser = false;
    res.send("/");
  }
  console.log(req.session.profile);
});
app.listen("3300", function () {
  console.log("Server is connected");
});
