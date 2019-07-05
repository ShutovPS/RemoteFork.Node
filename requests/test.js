"use strict";

const KEY = "/test";

const httpStatus = require("http-status-codes");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const SelfReloadJSON = require('self-reload-json');

const pjson = new SelfReloadJSON("package.json");
const settings = new SelfReloadJSON("settings.json");

router.get("/",
    function (req, res) {
        const headers = {
            "Content-Type": "text/html; charset=utf-8"
        };

		let ace = " with Ace Stream";
		if (!settings.AceStream.Enable) {
			ace = "";
        }

        const response = `<html><h1>ForkPlayer DLNA Work!</h1><br><b>RemoteFork Server. v.${pjson.version}</b>${ace}</html>`;

		res.writeHead(httpStatus.OK, headers);
		res.end(response);
    });
