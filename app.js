var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var compression = require("compression");
var helmet = require("helmet");
var session = require("express-session");

var indexRouter = require("./routes/index");

require("dotenv").config({
  path: path.join(__dirname, ".env.server"),
});

var app = express();

//Set up mongoose connection
var mongoose = require("mongoose");
// var mongoDB = `${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`;
// var mongoDB =
//   "mongodb+srv://Admin:75tofATiF9UNWcJ6@cluster0.qldfs.mongodb.net/ACP-AngelCasasPescadorBlog?retryWrites=true&w=majority";
var mongoDB = 'mongodb+srv://Admin:75tofATiF9UNWcJ6@cluster0-qldfs.mongodb.net/blog_database?retryWrites=true&w=majority';
console.log(mongoDB);
const option = {
  socketTimeoutMS: 90000,
  keepAlive: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose
  .connect(mongoDB, option)
  .then(function () {
    //connected successfully
    console.log("Successfully connected to database");
  })
  .catch((err) => console.error("Something went wrong", err));

// view engine setup
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "posts"),
]);
app.set("view engine", "pug");
app.locals.basedir = path.join(__dirname, "views");

app.use(
  session({
    secret: "acpblogsecret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression()); // Compress all routes

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", indexRouter); // Add index Route to middleware chain

//add the manifest
app.get("/manifest.json", function (req, res) {
  //send the correct headers
  res.header("Content-Type", "text/cache-manifest");
  //console.log(path.join(__dirname,"manifest.json"));
  //send the manifest file
  //to be parsed bt express
  res.sendFile(path.join(__dirname, "manifest.json"));
});

//add the service worker
// app.get("/sw.js", function (req, res) {
//   //send the correct headers
//   res.header("Content-Type", "text/javascript");

//   res.sendFile(path.join(__dirname, "sw.js"));
// });

// app.get("/loader.js", function (req, res) {
//   //send the correct headers
//   res.header("Content-Type", "text/javascript");

//   res.sendFile(path.join(__dirname, "loader.js"));
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "Wrong page, please go back to the Homepage."));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error-EN");
});

module.exports = app;
