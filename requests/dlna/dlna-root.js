"use strict";

const KEY = "/";

const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;

module.exports.router = router;

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");

const dlna = require("../dlna");
const userUrls = require("./dlna-urls");
const dlnaDirectory = require("./dlna-directory");
const plugins = require("../plugins");

const DirectoryItem = require("../../playlist/directory-item");
const PlayList = require("../../playlist/playlist");
const RootPlayList = require("../../playlist/root-playlist");

router.get("/", function (req, res) {
	let baseUrl = req.baseUrl;

	if (baseUrl.endsWith(KEY)) {
		baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf(KEY));
	}

	let playList = new PlayList();

	if (settings.Dlna.StartPageModernStyle) {
		playList = new RootPlayList();
	}

	const baseItem = new DirectoryItem();

	if (settings.UserUrls && settings.UserUrls.length !== 0) {
		const item = new DirectoryItem(baseItem);
		item.Title = "Пользовательские ссылки";
		item.Link = userUrls.createLink(baseUrl);

		playList.Items.push(item);
	}

	if (settings.Dlna.Enable) {
		if (settings.Dlna.Directories && settings.Dlna.Directories.length !== 0) {
			settings.Dlna.Directories.forEach(function (element) {
				if (fs.existsSync(element)) {
					const item = new DirectoryItem(baseItem);
					item.Title = dlna.fileName(element);
					item.Description = element;
					item.Link = dlnaDirectory.createLink(baseUrl, element);

					playList.Items.push(item);
				}
			});
		}
	}

	if (settings.Plugins.Enable) {
		if (plugins.Plugins && plugins.Plugins.length !== 0) {
			for (let key in plugins.Plugins) {
				const plugin = plugins.Plugins[key];

				const item = new DirectoryItem(baseItem);

				item.Title = plugin.title;
				item.Description = plugin.description;
				item.Image = plugin.icon;

				item.Link = plugins.createLink(plugin.key);

				playList.Items.push(item);
			}
		}
	}

	playList.sendResponse(res);
});
