/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("mongoose");
var config = require("./config/default.json");
var swaggerUi = require("swagger-ui-express");
var YAML = require("yamljs");
var swaggerDocument = YAML.load("swagger.yaml");


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var candidatesRouter = require("./routes/candidates");
var questionsRouter = require("./routes/questions");

var testsRouter = require("./routes/tests");

var skillsRouter = require("./routes/skills");

var app = express();

mongoose.connect(config.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},function(err, conn){
    if(err){
        console.log("Mongo Connection Error", err);
    }
    if(!err && conn){
        console.log("Mongo Connection Established");
    }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/candidates", candidatesRouter);
app.use("/questions", questionsRouter);
app.use("/tests", testsRouter);
app.use("/skills", skillsRouter);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
