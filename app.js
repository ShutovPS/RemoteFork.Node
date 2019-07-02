"use strict";
const fs = require("fs");
const path = require("path");

const httpStatus = require("http-status-codes");

const express = require("express");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const settingsManager = require("./settings-manager.js");

settingsManager.checkSettings();

const morgan = require("morgan");
const logger = require("./logger.js");
const analytics = require("./analytics.js");

const settings = require("./settings.json");

const main = require("./routes/main");

const registration = require("./server-registration");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use("/assets", [
    express.static(path.join(__dirname + "/node_modules/jquery/dist/")),
    express.static(path.join(__dirname + "/node_modules/bootstrap/dist/"))
]);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(morgan("combined", { stream: logger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    analytics.trackEvent(req.method, req.path, req.originalUrl, req.rawHeaders, req.query.box_mac);

    next();
});

app.use("/", main);
app.use("/main", main);

const registerRequest = (path) => {
    const module = require(path);

    module.KEYS.forEach(key => {
        app.use(key, module.router);
    });
}

const registerRequests = (directory) => {
    directory = path.join(__dirname, directory);

    let dirCont = fs.readdirSync( directory );
    let files = dirCont.filter( function( elm ) {
        return elm.endsWith(".js");
    });

    files.forEach(file => {
        try {
            registerRequest(path.join(directory, file));
        } catch(error) {
            console.error(error);
        }
    });
}

registerRequests("./requests/");


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

app.use(function(err, req, res, next) {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);

    const options = {
        title: "Error",
        message: err.message,
        
        error: null
    };

// development error handler
// will print stacktrace
    if (app.get("env") === "development") {
        options.error = err;
    }

    res.render("error", options);

    next(err);
});


app.use(function(err, req, res, next) {
    logger.error(err);

    analytics.trackEvent(err.message, req.path, req.originalUrl, req.rawHeaders, req.query.box_mac);

    next(err);
});

const ip = settings.Environment.IpAddress;
const port = settings.Environment.Port;

app.set("ip", ip);
app.set("port", process.env.PORT || port);

const server = app.listen(app.get("port"), app.get("ip"), function() {
	registration.register(ip, port);
    console.log(`Express server listening on port ${server.address().port}`);
});
