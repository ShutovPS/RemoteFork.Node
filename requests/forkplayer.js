"use strict";

const KEY = "/forkplayer";

const request = require("request-promise-native");
const httpStatus = require("http-status-codes");

const path = require("path");
const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const scriptUrl = "http://getlist5.obovse.ru/jsapp/app.js.php?run=js";

const scriptPath = "/public/temp/javascripts";
const scriptFile = "forkplayer.js";

router.get("/", async function(req, res) {
    if (global.env === "development") {
        req.headers["user-agent"] =
            "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chr0me/38.0.2125.122 Safari/537.36 LG Browser/8.00.00(LGE; 60UH6550-UB; 03.00.15; 1; DTV_W16N); webOS.TV-2016; LG NetCast.TV-2013 Compatible (LGE, 60UH6550-UB, wireless)";
    }

    const options = {
        url: scriptUrl,
        headers: {
            "User-Agent":req.headers["user-agent"]
        },
        timeout: 1500
    };

    const localFile = path.join(global.__rootname, scriptPath, scriptFile);

    try {
        const body = await request(options);

        const localPath = path.join(global.__rootname, scriptPath);

        if (body.length >= 1024) {
            const onWriteFile = error => {
                if (error) {
                    console.error(KEY, error);
                }
            }

            const onMkdir = error => {
                if (!error) {
                    fs.writeFile(localFile, body, onWriteFile);
                } else {
                    console.error(KEY, error);
                }
            }

            if (!fs.existsSync(localPath)) {
                fs.mkdir(localPath, { recursive: true }, onMkdir);
            }

            res.statusCode = httpStatus.OK;
            res.end(body);

            return;
        }
    } catch(error) {
        console.error(error);
    }
    
    if (fs.existsSync(localFile)) {
        console.log(KEY, "Found old script");
        res.statusCode = httpStatus.OK;
        fs.createReadStream(localFile).pipe(res);
    } else {
        res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        res.error = error;
        res.end(error.message);
    }
});
