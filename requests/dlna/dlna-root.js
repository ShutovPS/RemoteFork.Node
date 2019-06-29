"use strict";

const KEY = "/root";

const httpStatus = require("http-status-codes");

const path = require("path");
const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY, "/"];

module.exports.router = router;

const settings = require("../../settings.json");

const userUrls = require("./dlna-urls");
const dlnaDirectory = require("./dlna-directory");

const DirectoryItem = require("../../playlist/directory-item");
const PlayList = require("../../playlist/playlist");
const RootPlayList = require("../../playlist/root-playlist");

router.get("/",
    function (req, res) {
	    const headers = {
            "Content-Type": "text/json"
        };

		let playList = new PlayList();

		if (settings.StartPageModernStyle) {
			playList = new RootPlayList();
		}

		if (settings.UserUrls && settings.UserUrls.length !== 0) {
			const item = new DirectoryItem();
			item.Title = "Пользовательские ссылки";
            item.Link = userUrls.createLink();

			playList.Items.push(item);
		}

		if (settings.Dlna.Enable) {
            if (settings.Dlna.Directories && settings.Dlna.Directories.length !== 0) {
				settings.Dlna.Directories.forEach(function(element) {
					if (fs.existsSync(element)) {
						const item = new DirectoryItem();
                        item.Title = element.split(path.sep).pop();
                        item.Description = element;
                        item.Link = dlnaDirectory.createLink(element);

						playList.Items.push(item);
					}
				});
			}
		}

        const json = JSON.stringify(playList);

        res.writeHead(httpStatus.OK, headers);
		res.end(json);
	});
