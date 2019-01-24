var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fileUpload = require("express-fileupload");

var importRouter = require("./routes/import");
var searchRouter = require("./routes/search");

var app = express();

var mongoDB = "mongodb://127.0.0.1/pipedrive";
var mongoose = require("mongoose");
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// make public folder static
app.use(express.static(path.join(__dirname, "public")));
// make bootstrap and jquery folders static for easy referencing
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist/"));
app.use("/jquery", express.static("./node_modules/jquery/dist/"));

app.use(fileUpload());

app.use("/import", importRouter);
app.use("/search", searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
