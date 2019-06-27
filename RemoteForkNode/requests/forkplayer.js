"use strict";

module.exports.KEY = "/forkplayer";

const request = require("request");
const httpStatus = require("http-status-codes");

const path = require("path");
const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.router = router;

const scriptUrl = "http://getlist5.obovse.ru/jsapp/app.js.php?run=js";

const scriptPath = "public/temp/javascripts";
const scriptFile = "forkplayer.js";

router.get("/",
    function(req, res) {
        req.headers["user-agent"] =
            "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chr0me/38.0.2125.122 Safari/537.36 LG Browser/8.00.00(LGE; 60UH6550-UB; 03.00.15; 1; DTV_W16N); webOS.TV-2016; LG NetCast.TV-2013 Compatible (LGE, 60UH6550-UB, wireless)";

        const options = {
            url: scriptUrl,
            headers: {
                'User-Agent': req.headers["user-agent"]
            },
            timeout: 1500
        };

        const localPath = path.join(scriptPath, scriptFile);

        function callback(error, response, body) {
            if (!error && response.statusCode === httpStatus.OK && body.length > 1024) {
                if (!fs.existsSync(scriptPath)) {
                    fs.mkdirSync(scriptPath, { recursive: true }, err => {
                        console.log(err);
                    });
                }

                fs.writeFile(localPath,
                    body,
                    function(err) {
                        if (err) {
                            console.log(err);
                        }

                        console.log("New script was downloaded!");
                    });
            } else if (fs.existsSync(localPath)) {
                console.log("Found old script");

                res.statusCode = httpStatus.OK;
                fs.createReadStream(localPath).pipe(res);
            }

            res.statusCode = response.statusCode;
            res.error = error;
            res.end(body);
        }

        request(options, callback);
    });
