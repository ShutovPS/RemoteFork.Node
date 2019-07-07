"use strict";

const request = require("request");

exports.register = function(ip, port) {
    const url = `http://getlist2.obovse.ru/remote/index.php?v=1&do=list&localip=${ip}:${port}&proxy=false`;

    request(url,
        function (error, response, body) {
            if (error) {
                console.error(error);
            } else {
                console.log("registartion:", url);
            }
        });
}