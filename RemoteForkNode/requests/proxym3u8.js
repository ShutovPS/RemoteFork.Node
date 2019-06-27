"use strict";

const KEY = "/proxym3u8";

const mime = require("mime-type/with-db");

const request = require("request");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;
module.exports.router = router;

const endbase64 = "endbase64";
const proxym3u8 = "proxym3u8";

const opt = "OPT:";
const opend = "OPEND:";

function processResponse(res, url) {
        const headers = [];

        let ts = "";

        if (url.startsWith("B")) {
            url = url.substring(1);

            let endUrl = "";

            if (url.includes(endbase64)) {
                const ind = url.indexOf(endbase64);

                endUrl = url.substring(ind + endbase64.length);
                url = url.substring(0, ind);
            }

            url = Buffer.from(url, "base64").toString("utf8") + endUrl;
        }

        if (url.includes(opt)) {
            if (url.includes(opend)) {
                if (!url.endsWith(opend)) {
                    ts = url.substring(url.indexOf(opend) + opend.length);
                }
                url = url.substring(0, url.indexOf(opend));
            }

            const params = url.substring(url.indexOf(opt) + opt.length);

            if (params.includes("--")) {
                const matches = params.split("--");

                if (matches != undefined && matches.length !== 0) {

                    for (let i = 0; i < matches.length; i++) {
                        const k = matches[i];
                        const v = matches[++i];

                        if (k.trim() != undefined && v != undefined) {
                            headers[k] = v;
                        }
                    }
                }
            }

            url = url.substring(0, url.indexOf(opt));
        }
        console.log(url);
        if (!headers.hasOwnProperty("ContentType")) {
            if (ts.trim() != undefined) {
                url = url.substring(0, url.lastIndexOf("/") + 1) + ts;

                res.ContentType = mime.lookup(".ts");
            } else {
                res.ContentType = mime.lookup(".m3u8");
            }
        } else {
            res.ContentType = headers["ContentType"];
        }

        const options = {
            url: url,
            headers: headers
        };

        function callback(error, response, body) {
            if (!error) {
                console.log(`response statusCode: ${response.statusCode}`);
            } else {
                console.log(`response error: ${error}`);
            }
        }

        function dataCallback(data) {
            res.end(data);
        }

        request(options, callback)
            .on("data", dataCallback)
            .on("response",
                function (response) {
                    response.on("data", dataCallback);
                });
}

router.get("/",
    function (req, res) {
        const url = req.query.link;

        processResponse(res, url);
    });

router.get("/+",
    function (req, res) {
        const url = req.url.substring(proxym3u8.length + 1);

        processResponse(res, url);
    });
