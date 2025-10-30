var express = require("express")
var router = express.Router()
let schemas = require("../../views/module_exports/00_mongoDb")
let User = schemas.User

router.get("/signIn", function (req, res) {
  res.render("pages/signing/00_signIn.ejs")
})
router.get("/signUp", function (req, res) {
  res.render("pages/signing/01_signUp.ejs")
})
router.post("/signUp", function (req, res) {
  let body = req.body
  let signUpInfo = {
    profile_name: body.prof_name,
    profile_email: body.prof_email,
    profile_password: body.prof_password,
    profile_age: body.prof_age,
  }
  User.findOne({ profile_email: body.prof_email })
    .then((data) => {
      if (data) {
        res.send(`Profile with the same email already exists`)
      } else {
        User.create(signUpInfo)
          .then((data) => {
            req.session.destroy()
            req.session.userId = data._id
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    })
    .catch(function (error) {
      console.log(error)
    })
})

module.exports = router
