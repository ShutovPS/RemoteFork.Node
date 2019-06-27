"use strict";

const settings = require("./settings.json");

const main = require("./routes/main");

const test = require("./requests/test");
const userUrls = require("./requests/user-urls");
const acestream = require("./requests/acestream");

const dlnaRoot = require("./requests/dlna-root");
const dlnaDirectory = require("./requests/dlna-directory");
const dlnaFile = require("./requests/dlna-file");

const parserlink = require("./requests/parserlink");
const pluginIcon = require("./requests/plugin-icon");

const proxym3u8 = require("./requests/proxym3u8");

const forkPlayer = require("./requests/forkplayer");

const registration = require("./server-registration");

const debug = require("debug");

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

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

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.use("/", main);
app.use("/main", main);

app.use(test.KEY, test.router);
app.use(userUrls.KEY, userUrls.router);
app.use(acestream.KEY, acestream.router);

app.use(dlnaRoot.KEY, dlnaRoot.router);
app.use(dlnaDirectory.KEY, dlnaDirectory.router);
app.use(dlnaFile.KEY, dlnaFile.router);

app.use(forkPlayer.KEY, forkPlayer.router);

app.use(proxym3u8.KEY, proxym3u8.router);
app.use(/^\/proxym3u8.*$/, proxym3u8.router);

app.use(parserlink.KEY, parserlink.router);
app.use(pluginIcon.KEY, pluginIcon.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("error",
            {
                title: "Error",
                message: err.message,
                error: err
            });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render("error",
		{
			title: "Error",
			message: err.message,
			error: {}
		});
});

const ip = settings.Environment.IpAddress;
const port = settings.Environment.Port;

app.set("ip", ip);
app.set("port", process.env.PORT || port);

const server = app.listen(app.get("port"), app.get("ip"), function () {
	registration.register(ip, port);
    debug(`Express server listening on port ${server.address().port}`);
});
