"use strict";

const KEY = "/directory";

const httpStatus = require("http-status-codes");

const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const dlna = require("../dlna");

const settings = require("../../settings.json");
const configs = require("../../configs.js");

const dlnaFile = require("./dlna-file");

const DirectoryItem = require("../../playlist/directory-item");
const FileItem = require("../../playlist/file-item");
const PlayList = require("../../playlist/playlist");

function processRequest(res, localPath) {
    const headers = {
        "Content-Type": "text/json"
    };

    const playList = new PlayList();

    const dirs = dlna.getDirectories(localPath);

    if (dirs != undefined) {
        dirs.forEach(function (dir) {
            const item = new DirectoryItem();

            item.Title = dlna.fileName(dir);
            item.Description = dir;
            item.Link = createLink(dir);

            playList.Items.push(item);
        });
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
                item.Link = dlnaFile.createLink(file);

                playList.Items.push(item);
            }
        });
    }

    const json = JSON.stringify(playList);

    res.writeHead(httpStatus.OK, headers);
    res.end(json);
}

router.get("/", function (req, res) {
    const localPath = decodeURIComponent(req.query.path);

    if (localPath && fs.existsSync(localPath) && dlna.isDirectory(localPath)) {
        processRequest(res, localPath);
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.end(localPath);
    }
});

function createLink(localPath) {
    return `${configs.remoteForkAddress}${dlna.KEY}${KEY}?path=${
        encodeURIComponent(localPath)}`;
}

module.exports.createLink = createLink;
