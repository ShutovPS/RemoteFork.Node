"use strict";

const KEY = "/dlna_directory";

const path = require("path");
const fs = require("fs");
const pretty = require('prettysize');

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;
module.exports.router = router;

const settings = require("../settings.json");
const configs = require("../configs.js");

const dlnaFile = require("./dlna-file");

const DirectoryItem = require("../playlist/directory-item");
const FileItem = require("../playlist/file-item");
const PlayList = require("../playlist/playlist");

const fileSize = (filePath) => {
    try {
        const stat = fs.statSync(filePath);
        return pretty(stat.size);
    } catch (e) {
        return pretty(0);
    }
}

const fileName = (filePath) => {
    return filePath.split(path.sep).pop();
}

const isDirectory = localPath => {
    try {
        return fs.statSync(localPath).isDirectory();
    } catch (e) {
        return false;
    }
}

const getDirectories = localPath =>
    fs.readdirSync(localPath).map(name => path.join(localPath, name)).filter(isDirectory);

const isFile = localPath => {
    try {
        return fs.statSync(localPath).isFile();
    } catch (e) {
        return false;
    }
}

const getFiles = localPath =>
    fs.readdirSync(localPath).map(name => path.join(localPath, name)).filter(isFile);

router.get("/",
    function (req, res) {
        const headers = {
            "Content-Type": "text/json"
        };

        const directoryName = decodeURIComponent(req.query.path);

        const localPath = directoryName;

        const playList = new PlayList();

        if (fs.existsSync(localPath)) {
            const dirs = getDirectories(localPath);

            if (dirs != undefined) {
                dirs.forEach(function (dir) {
                    const item = new DirectoryItem();

                    item.Title = fileName(dir);
                    item.Description = dir;
                    item.Link = createLink(dir);

                    playList.Items.push(item);
                });
            }

            const files = getFiles(localPath);

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

                        item.Title = `${fileName(file)} (${fileSize(file)})`;
                        item.Description = file;
                        item.Link = dlnaFile.createLink(file);

                        playList.Items.push(item);
                    }
                });
            }
        }

        const json = JSON.stringify(playList);

        res.writeHead(200, headers);
        res.end(json);
    });

function createLink(localPath) {
    return `${configs.remoteForkAddress}${KEY}?path=${
        encodeURIComponent(localPath)}`;
}

module.exports.createLink = createLink;
