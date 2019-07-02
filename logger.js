"use strict";

const path = require("path");

const winston = require("winston");
require('winston-daily-rotate-file');

const logDirectory = "./logs";

var infofile = new winston.transports.DailyRotateFile({
    level: "info",
    filename: path.resolve(logDirectory, "%DATE%-info.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "100m",
    maxFiles: "14d" // keep logs for 14 days
});

infofile.on("rotate", function (oldFilename, newFilename) {
    // do something fun
});

var errorfile = new winston.transports.DailyRotateFile({
    level: "error",
    filename: path.resolve(logDirectory, "%DATE%-error.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d" // keep logs for 30 days
});

errorfile.on("rotate", function (oldFilename, newFilename) {
    // do something fun
});

const logger = winston.createLogger({
    transports: [infofile, errorfile]
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

module.exports = logger;
