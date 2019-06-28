"use strict";

const KEY = "/dlna/file";

const httpStatus = require("http-status-codes");

const mime = require("mime-type/with-db");

const fs = require("fs");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const configs = require("../configs.js");

function fetchFileSize(filePath) {
  const stat = fs.statSync(filePath);
  return stat.size;
}

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


router.get("/", function (req, res) {
  const localPath = decodeURIComponent(req.query.path);
  
  if (fs.existsSync(localPath)) {
    const totalSize = fetchFileSize(localPath);

    const range = req.headers["range"];

    if (range) {
      const {start, end, chunkSize} = generateIndexesWithGivenLength(range, totalSize);
      const file = fs.createReadStream(localPath, {start, end});
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': "bytes",
        'Content-Length': chunkSize,
        'Content-Type': mime.lookup(localPath)
      });
      file.pipe(res);

    } else {
      console.log(KEY, `No Request Header - Serving Whole Video With Total Size: ${totalSize}`);

      res.writeHead(httpStatus.OK, {
        'Content-Length': totalSize,
        'Content-Type': mime.lookup(localPath)
      });

      fs.createReadStream(localPath).pipe(res);
    }
  } else {
    res.end(localPath);
  }
});

function createLink(localPath) {
  return `${configs.remoteForkAddress}${KEY}?path=${
      encodeURIComponent(localPath)}`;
}

module.exports.createLink = createLink;
