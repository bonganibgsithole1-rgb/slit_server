const express = require("express")
const session = require("express-session")
mongoose = require("mongoose")
let log = require("node-file-logger")
let MongoStore = require("connect-mongo")

const app = express()

// MONGODB
mongoose.connect("mongodb://0.0.0.0:27017/slit_Server")
let db = mongoose.connection
mongoose.set("strictQuery", true)
//mongo error
db.on("error", log.Info.bind(console, "connection failed"))

app.use(
  session({
    secret: "Slit Server",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongooseConnection: db,
      mongoUrl: "mongodb://0.0.0.0:27017/slit_Server",
      collections: "sessions",
    }),
  })
)

function regenerateSession(a) {}

module.exports = { regenerateSession }
