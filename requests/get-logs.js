"use strict";

const KEY = "/getlogs";

const httpStatus = require("http-status-codes");

const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const dlna = require("./dlna");

const logsPath = "logs";
const logsReg = /(\d{4}-\d{2}-\d{2})-(\w+)(.log)/;

function processRequest(res, type) {
    let files = dlna.getFiles(logsPath);

    let result = false;

    if (files != undefined) {
        files = files.map(function (fileName) {
            return {
              name: fileName,
              time: fs.statSync(fileName).mtime.getTime()
            };
          })
          .sort(function (a, b) {
            return a.time - b.time;
         })
          .map(function (v) {
            return v.name; 
        });

        files.forEach(function (file) {
            if (file.includes(type)) {
                if (logsReg.exec(file)) {
                    result = true;

                    fs.createReadStream(file).pipe(res);
                    return;
                }
            }
        });
    }

    if (result === false) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.end(type);
    }
}

router.get("/:type", function (req, res) {
    const type = req.params.type;
    if (type) {
        processRequest(res, type);
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.end(localPath);
    }
});
