"use strict";

const KEY = "/directory";

const httpStatus = require("http-status-codes");

const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;

module.exports.router = router;

const dlna = require("../dlna");

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");
const configs = require("../../configs");

const dlnaFile = require("./dlna-file");

const DirectoryItem = require("../../playlist/directory-item");
const FileItem = require("../../playlist/file-item");
const PlayList = require("../../playlist/playlist");

function processRequest(baseUrl, res, localPath) {
    const playList = new PlayList();

    try {
        const dirs = dlna.getDirectories(localPath);

        if (dirs != undefined) {
            dirs.forEach(function (dir) {
                const item = new DirectoryItem();

                item.Title = dlna.fileName(dir);
                item.Description = dir;
                item.Link = createLink(baseUrl, dir);

                playList.Items.push(item);
            });
        }
    } catch(e) {
        console.error(KEY, e);
    }

    const files = dlna.getFiles(localPath);

    if (files != undefined) {
        files.forEach(function(file) {
            let good = false;

            if (settings.Dlna.FileExtensions != undefined && settings.Dlna.FileExtensions.length !== 0) {
                settings.Dlna.FileExtensions.forEach(function(extension) {
                    if (file.endsWith(extension)) {
                        good = true;
                    }
                });
            } else {
                good = true;
            }
            if (good) {
                const item = new FileItem();

                item.Title = `${dlna.fileName(file)} (${dlna.fileSize(file)})`;
                item.Description = file;
                item.Link = dlnaFile.createLink(baseUrl, file);

                playList.Items.push(item);
            }
        });
    }

    playList.sendResponse(res);
}

router.get("/", function (req, res) {
    const localPath = decodeURIComponent(req.query.path);

    if (settings.Dlna.Enable && localPath && fs.existsSync(localPath) && dlna.isDirectory(localPath)) {
        let baseUrl = req.baseUrl;

        if (baseUrl.endsWith(KEY)) {
            baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf(KEY));
        }

        processRequest(baseUrl, res, localPath);
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.end(localPath);
    }
});

function createLink(baseUrl, localPath) {
    return `${configs.remoteForkAddress}${baseUrl}${KEY}?path=${
        encodeURIComponent(localPath)}`;
}

module.exports.createLink = createLink;
