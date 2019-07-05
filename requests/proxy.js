"use strict";

const KEY = "/proxy";

const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const requestsPath = "./proxy/";

const registerRequest = (path) => {
    const module = require(path);

    if (module.KEYS != undefined) {
        module.KEYS.forEach(key => {
            router.use(key, module.router);
        });
    }
}

const registerRequests = (directory) => {
    directory = path.join(__dirname, directory);

    let dirCont = fs.readdirSync( directory );
    let files = dirCont.filter( function( elm ) {
        return elm.endsWith(".js");
    });

    files.forEach(file => {
        try {
            registerRequest(path.join(directory, file));
        } catch(error) {
            console.error(error);
        }
    });
}

function cleanHeaders(headers, excludes) {
    return [headers].reduce(function(r, o) {
        Object.keys(o).forEach(function(k) {
            if (excludes.indexOf(k.toLowerCase()) === -1) {
                r[k] = o[k];
            }
        });
        return r;
    },
    {});
}
module.exports.cleanHeaders = cleanHeaders;

function concatHeaders(headers, advHeaders) {
    function createObj(obj1, obj2){
        var temp = [];
        for (var i in obj1) {
            temp[i] = obj1[i];
        }
        for (var j in obj2) {
            temp[j] = obj2[j];
        }
        return temp;
    };
    
    const dict = createObj(headers, advHeaders);

    return dict;
}
module.exports.concatHeaders = concatHeaders;

function parseResposeData(headers, data, options) {
    if (headers) {
        options.headers = concatHeaders(options.headers, headers);
    }

    if (data) {
        options.method = "POST";
        options.form = data;
    }
}
module.exports.parseResposeData = parseResposeData;

registerRequests(requestsPath);