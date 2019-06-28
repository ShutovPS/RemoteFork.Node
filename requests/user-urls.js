"use strict";

module.exports.KEY = "/user_urls";

const httpStatus = require("http-status-codes");

const express = require("express");
const router = express.Router();

module.exports.router = router;

const settings = require("../settings.json");
const configs = require("../configs.js");

const FileItem = require("../playlist/file-item");
const PlayList = require("../playlist/playlist");

router.get("/",
    function (req, res) {
        const headers = {
            "Content-Type": "text/json"
        };

        const playList = new PlayList();

        const baseItem = new FileItem();

        if (settings.UserUrls && settings.UserUrls.length !== 0) {
			settings.UserUrls.forEach(function(element) {
				const item = new FileItem(baseItem);
				item.Title = element;
				item.Link = element;

				playList.Items.push(item);
			});
		}

        const json = JSON.stringify(playList);

        res.writeHead(httpStatus.OK, headers);
		res.end(json);
    });

function createLink() {
    return `${configs.remoteForkAddress}${KEY}`;
}

module.exports.createLink = createLink;
