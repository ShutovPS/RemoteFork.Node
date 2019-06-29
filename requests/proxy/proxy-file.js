"use strict";

const KEY = "/file";

const request = require("request");
const httpStatus = require("http-status-codes");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];
module.exports.router = router;

const proxy = require("../proxy");

const excludeHeaders = ["host"];

router.get("/",
    function(req, res) {
        const url = req.query.link;

        if (url) {
            const headers = proxy.cleanHeaders(req.headers, excludeHeaders);

            const options = {
                url: url,
                method: "GET",
                headers: headers
            }

            const data = req.query.data;

            if (data) {
                proxy.parseResposeData(data, options);
            }
            
            if (req.query.followRedirect === "false") {
                options.followRedirect = false;
            }
            
            if (req.query.method !== undefined) {
                options.method = method;
            }

            request(options)
                .on("response",
                    function(response) {
                    })
                .pipe(res);
        } else {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            res.end(localPath);
        }
    });

