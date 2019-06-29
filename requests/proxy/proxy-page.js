"use strict";

const KEY = "/page";

const request = require("request");
const httpStatus = require("http-status-codes");

const iconv = require("iconv-lite");
const jschardet = require("jschardet");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const proxy = require("../proxy");

function sendRequest(options, callback, responseProcess) {
    request(options,
        function(error, response, body) {
            var result = "";

            if (!error) {
                try {
                    let charSet = jschardet.detect(body);
                    console.log(KEY, charSet);
    
                    result = iconv.decode(body, charSet.encoding);
                } catch (e) {
                    result = iconv.decode(body, 'utf8');
                }

                if (responseProcess != undefined) {
                    result = responseProcess(response, result);
                }
            }
            callback(error, response, result);
        });
}

function onHeadResponse(response, body) {
    const responseHeaders = response.headers;

    let sh = "";

    for (let key in responseHeaders) {
        sh += key + ": " + responseHeaders[key] + "\r\n";
    }

    return `${sh}\r\n${body}`;
}

function onProcessRequest(req, res, url) {
    if (url) {
        const options = {
            method: "GET",
            url: url,
            headers: [],
            encoding: null
        }

        const data = req.query.data;

        if (data) {
            proxy.parseResposeData(data, options);
        }
        
        if (req.query.followRedirect === "false") {
            options.followRedirect = false;
        } else {
            options.followRedirect = true;
        }
        
        if (req.query.method != undefined) {
            options.method = req.query.method;
        }

        sendRequest(options, function(error, response, body) {
            if (error) {
                console.error(error);
            }

            if (req.query.returnHeaders === "true") {
                body = onHeadResponse(response, body);
            }

            res.error = error;

            if (response && response.statusCode) {
                res.statusCode = response.statusCode;
            } else if (error) {
                res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            }

            res.set({ 'content-type': 'text/html; charset=utf-8' });
            res.end(body);
        });
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.end(localPath);
    }
}

router.get("/",
    function(req, res) {
        onProcessRequest(req, res, req.query.link);
    });