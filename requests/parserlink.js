"use strict";

const KEY = "/parserlink";

const request = require("request");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;
module.exports.router = router;

function curlRequest(link, callback) {
    if (link.startsWith("curlorig")) {
        link = link.substring(9);

        getRequest(link, callback);
    } else {
        const verbose = link.includes(" -i");
        const autoRedirect = link.includes(" -L");

        const headers = [];

        let regex = /(?:")(.*?)(?:")/;

        const url = regex.exec(link)[1];

        console.log("url", url);

        regex = /(?:-H\s")(.*?)(?:")/gm;

        let match = regex.exec(link);

        const valueRegex = /(.+?)(?:\s*\:\s*)(.+)/;

        while (match != undefined) {
            const m = valueRegex.exec(match[1]);

            if (m != undefined) {
                headers[m[1].trim()] = m[2].trim();
            }

            match = regex.exec(link);
        }

        if (link.includes("--data")) {
            regex = /(?:--data\s")(.*?)(?=\s*")/gm;

            const dataString = link.match(regex)[1];

            postRequest(url, callback, dataString, headers, autoRedirect);
        } else if (verbose) {
            headRequest(url, callback, headers, autoRedirect);
        } else {
            getRequest(url, callback, headers, autoRedirect);
        }
    }
}

function getOptions(method, link, heads, autoRedirect, data) {
    if (heads == undefined) {
        heads = [];
    }
    const options = {
        method: method,
        url: link,
        headers: heads,
        followRedirect: autoRedirect
    };

    if (data != undefined) {
        options.form = data;
    }

    return options;
}

function sendRequest(options, callback, responseProcess) {
    request(options,
        function(error, response, body) {
            if (error) {
                callback(false, error);
            } else {
                if (responseProcess != undefined) {
                    body = responseProcess(response, body);
                }
                callback(true, body);
            }
        });
}

function headRequest(link, callback, heads, autoRedirect) {
    console.log("headRequest", link);

    const onResponse = (response, body) => {
        const responseHeaders = response.headers;
        /*const responseHeaders = [heads, response.headers].reduce(function(r, o) {
                Object.keys(o).forEach(function(k) { r[k] = o[k]; });
                return r;
            },
            {});*/

        let sh = "";

        for (let key in responseHeaders) {
            sh += key + ": " + responseHeaders[key] + "\r\n";
        }

        return `${sh}\r\n${body}`;
    }

    sendRequest(getOptions(!autoRedirect?"HEAD":"GET", link, heads, autoRedirect), callback, onResponse);
}

function getRequest(link, callback, heads, autoRedirect) {
    console.log("getRequest", link);

    sendRequest(getOptions("GET", link, heads, autoRedirect), callback);
}

function postRequest(link, callback, data, heads, autoRedirect) {
    console.log("postRequest", link);

    sendRequest(getOptions("POST", link, heads, autoRedirect, data), callback);
}

function parselink(res, link) {
    const requestStrings = link.split("|");

    if (requestStrings != undefined) {
        console.log("parselink:", requestStrings[0]);

        const onResponse = (result, response) => {
            if (result) {
                let result = "";

                if (requestStrings.length === 1) {
                    result = response;
                } else {
                    if (!requestStrings[1].includes(".*?")) {
                        if (requestStrings[1] == undefined && requestStrings[2] == undefined) {
                            result = response;
                        } else {
                            let ind = response.indexOf(requestStrings[1]);

                            if (ind !== -1)
                                ind += requestStrings[1].length;
                            const ind2 = response.indexOf(requestStrings[2], ind);
                            result = ind2 === -1 ? "" : response.substring(ind, ind2 - ind);
                        }
                    } else {
                        const pattern = requestStrings[1] + "(.*?)" + requestStrings[2];

                        console.log("ParseLinkRequest: ", pattern);

                        const regex = new RegExp(pattern, "m");
                        if (regex.test(response)) {
                            const match = regex.match(response);

                            if (match != undefined && match.length !== 0) {
                                result = match[1];
                            }
                        }
                    }
                }

                res.end(result);
            } else {
                console.error(response);

                res.statusCode = 500;
                res.error = response;
                res.end();
            }
        }

        if (requestStrings[0].startsWith("curl")) {
            curlRequest(requestStrings[0], onResponse);
        } else {
            getRequest(requestStrings[0], onResponse);
        }
    } else {
        res.end();
    }
}

function onProcessRequest(req, res, url) {
    if (req.query.link) {
        url = decodeURIComponent(req.query.link);
    } else {
        url = decodeURIComponent(url).substring(2);
    }

    const parseurl = (res, url) => {
        console.log("parseurl:", url);

        if (url.trim()) {
            parselink(res, url);
        } else {
            res.end();
        }
    }

    parseurl(res, url);
}

router.get("/",
    function(req, res) {
        onProcessRequest(req, res, req.url);
    });

router.post("/",
    function(req, res) {
        let url = "";

        if (req.body != undefined && Object.keys(req.body).length > 0) {
            for (let key in req.body) {
                console.log(key, req.body[key].trim());
                url += key;
                if (req.body[key].trim()) {
                    url += "=" + req.body[key];
                }
            }
        } else {
            url = req.url;
        }

        onProcessRequest(req, res, url);
    });
