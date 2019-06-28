"use strict";

const KEY = "/proxy/file";

const request = require("request");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];
module.exports.router = router;

router.get("/",
    function(req, res) {
        const url = req.query.link;

        const excludeHeaders = ["host"];

        const headers = [req.headers].reduce(function(r, o) {
                Object.keys(o).forEach(function(k) {
                    if (excludeHeaders.indexOf(k.toLowerCase()) === -1) {
                        r[k] = o[k];
                    }
                });
                return r;
            },
            {});

        const options = {
            url: url,
            headers: headers
        }

        request(options)
            .on("response",
                function(response) {
                })
            .pipe(res);
    });

