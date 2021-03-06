"use strict";

const KEY = "/treeview";

const fs = require("fs");
const path = require("path");

const pretty = require("prettysize");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const requestsPath = "./dlna/";

const registerRequest = (path) => {
    const module = require(path);

    if (module.KEY) {
        router.use(module.KEY, module.router);
    }
}

const registerRequests = (directory) => {
    directory = path.join(__dirname, directory);

    let dirCont = fs.readdirSync( directory );
    let files = dirCont.filter( function( elm ) {
        return elm.endsWith(".js");
    });

    files.forEach(file => {
        try {
            registerRequest(path.join(directory, file));
        } catch(error) {
            console.error(KEY, error);
        }
    });
}

function fetchFileSize(filePath) {
    try {
        const stat = fs.statSync(filePath);
        return stat.size;
    } catch (error) {
        return 0;
    }
}
module.exports.fetchFileSize = fetchFileSize;

const fileSize = (filePath) => {
    return pretty(fetchFileSize);
}
module.exports.fileSize = fileSize;

const fileName = (filePath) => {
    return filePath.split(path.sep).pop();
}
module.exports.fileName = fileName;

const isDirectory = localPath => {
    try {
        return fs.statSync(localPath).isDirectory();
    } catch (error) {
        return false;
    }
}
module.exports.isDirectory = isDirectory;

const getDirectories = localPath =>
    fs.readdirSync(localPath).map(name => path.join(localPath, name)).filter(isDirectory);
module.exports.getDirectories = getDirectories;

const isFile = localPath => {
    try {
        return fs.statSync(localPath).isFile();
    } catch (error) {
        return false;
    }
}
module.exports.isFile = isFile;

const getFiles = localPath =>
    fs.readdirSync(localPath).map(name => path.join(localPath, name)).filter(isFile);
module.exports.getFiles = getFiles;

registerRequests(requestsPath);