"use strict";

module.exports.KEY = "/acestream/acestream";

const configs = require("../configs.js");

const FileItem = require("../playlist/file-item");
const PlayList = require("../playlist/playlist");

const path = require("path");
const request = require("request");

const express = require("express");
const router = express.Router();

module.exports.router = router;

router.post("/",
    function (req, res) {
	    const headers = {
            "Content-Type": "text/json"
        };

        const url = decodeURIComponent(req.body);

		const source = getFileList(url);

        res.writeHead(200, headers);
		res.end(source);
	});

router.get("/",
    function (req, res) {
	    const headers = {
            "Content-Type": "text/json"
        };

        const url = decodeURIComponent(req.queryString);

        const source = getFileList(url);

        res.writeHead(200, headers);
        res.end(source);
	});

module.exports.getContentId = function (torrentData) {
    request.post(url, torrentData,
		function (error, response, body) {
			if (body.trim() != undefined) {
                const content = JSON.parse(body);

                if (content.Error != undefined) {
                    return content.ContentID;
				}
            }
            return [];
		});

	return response;
}

module.exports.getFileList = function(url) {
	if (url.startsWith("s=B")) {
		url = url.substring(3);

		const contentId = getContentId(url);
		source = getFileList(getFileList(contentId, "content_id"), contentId, "content_id");
	} else if (url.startsWith("torrenturl=")) {
		url = url.substring(11);
		url = decodeURIComponent(url);

		if (url.startsWith("torrent://")) {
			url = url.substring(10);
		}

		request(url,
            function (error, response, body) {
                if (body.trim() != undefined) {
                    const files = JSON.parse(body);

                    if (files.Error != undefined) {
						return files.Result;
					}
                }
                return [];
			});

		request(url,
			function (error, response, body) {
				const data = Buffer.from(body).toString("base64");

				const contentId = getContentId(data);
				source = getFileList(getFileList(contentId, "content_id"), contentId, "content_id");
			});

		url = url.substring(7);

		source = getFileList(getFileList(url, "magnet"), url, "magnet");
    }

	return source;
}

module.exports.getFileList = function (key, type) {
    const url = `${configs.aceStreamAddress}/server/api?method=get_media_files&${type}=${key}`;

    request(url,
		function (error, response, body) {
            if (body.trim() != undefined) {
                const files = JSON.parse(body);

                if (files.Error != undefined) {
					return files.Result;
				}
            }
            return [];
		});

	return [];
}

module.exports.getFileList = function(files, key, type) {
    const playList = new PlayList();

	if (files.count > 0) {
        let url = `${configs.aceStreamAddress}/ace/getstream?${type}=${key}`;

        if (files.count > 1) {
			request(url,
	            function(error, response, body) {
		            return body;
	            });
		} else {
			let item = new FileItem();
            item.Title = path.basename(files[0]);
            item.Link = url;
            playList.Items.push(item);

            url = `${configs.aceStreamAddress}/ace/manifest.m3u8?${type}=${key}`;

            item = new FileItem();
            item.Title = `(hls) ${path.basename(files[0])}`;
            item.Link = url;
            playList.Items.push(item);
		}
    }

    const json = JSON.stringify(playList);

    return json;
}
