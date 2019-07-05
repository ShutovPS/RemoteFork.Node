"use strict";

const KEY = "/urls";

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;

module.exports.router = router;

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");
const configs = require("../../configs");

const FileItem = require("../../playlist/file-item");
const PlayList = require("../../playlist/playlist");

router.get("/",
    function (req, res) {
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

        playList.sendResponse(res);
    });

function createLink(baseUrl) {
    return `${configs.remoteForkAddress}${baseUrl}${KEY}`;
}

module.exports.createLink = createLink;
