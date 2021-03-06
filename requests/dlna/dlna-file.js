"use strict";

const KEY = "/file";

const httpStatus = require("http-status-codes");

const mime = require("mime-type/with-db");

const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY

module.exports.router = router;

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");

const dlna = require("../dlna");

const configs = require("../../configs");

function generateIndexesWithGivenLength(headerRange, totalSize) {
  const parts = headerRange.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
  const chunkSize = (end - start) + 1;

  console.log(KEY, `RANGE: ${start} - ${end} = ${chunkSize}`);

  return {
    start: start,
    end: end,
    chunkSize: chunkSize
  };
}

function processRequest(req, res, localPath) {
  const totalSize = dlna.fetchFileSize(localPath);

  const range = req.headers["range"];

  if (range) {
    const {start, end, chunkSize} = generateIndexesWithGivenLength(range, totalSize);
    const file = fs.createReadStream(localPath, {start, end});
    res.writeHead(httpStatus.PARTIAL_CONTENT, {
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Accept-Ranges': "bytes",
      'Content-Length': chunkSize,
      'Content-Type': mime.lookup(localPath)
    });
    file.pipe(res);

  } else {
    console.log(KEY, "No Request Header - Serving Whole Video With Total Size:", totalSize);

    res.writeHead(httpStatus.OK, {
      'Content-Length': totalSize,
      'Content-Type': mime.lookup(localPath)
    });

    fs.createReadStream(localPath).pipe(res);
  }
}

router.get("/", function (req, res) {
  const localPath = decodeURIComponent(req.query.path);
  
  if (settings.Dlna.Enable && localPath && fs.existsSync(localPath) && dlna.isFile(localPath)) {
    processRequest(req, res, localPath);
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.end(localPath);
  }
});

function createLink(baseUrl, localPath) {
  return `${configs.remoteForkAddress}${baseUrl}${KEY}?path=${
      encodeURIComponent(encodeURIComponent(localPath))}`;
}

module.exports.createLink = createLink;
