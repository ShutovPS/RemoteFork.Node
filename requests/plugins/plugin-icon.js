"use strict";

const KEY = "/icon";

const request = require("request");
const httpStatus = require("http-status-codes");

const mime = require("mime-type/with-db");

const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

module.exports.KEYS = [KEY];

module.exports.router = router;

const iconsPath = "public/temp/plugins/";

router.get("/",
    function(req, res) {
        const pluginId = req.query.pluginId;

        if (pluginId != undefined && pluginId.trim()) {
            const filePath = path.join(iconsPath, pluginId + ".png");

            const scriptUrl = "https://img.icons8.com/dusk/384/night-camera.png";

            if (fs.existsSync(filePath)) {
                res.statusCode = httpStatus.OK;
                res.setHeader("Content-type", mime.lookup(filePath));
                fs.createReadStream(filePath).pipe(res);
                return;
            } else {
                const sendFile = (data) => {
                    res.statusCode = httpStatus.OK;
                    res.setHeader("Content-Type", mime.lookup(filePath));
                    res.end(data);
                }

                const saveFile = (data) => {
                    try {
                        if (data.length > 0) {
                            if (!fs.existsSync(iconsPath)) {
                                fs.mkdirSync(iconsPath,
                                    { recursive: true },
                                    (errorMkdir) => {
                                        if (errorMkdir) {
                                            throw errorMkdir;
                                        }
                                    });
                            }

                            fs.writeFile(filePath,
                                data,
                                function(errorWrite) {
                                    if (errorWrite) {
                                        console.error(KEY, errorWrite);
                                    }
                                });
                        }
                    } catch(error) {
                        console.error(KEY, error);
                    }
                }

                let options = {
                    url: scriptUrl,
                    encoding: null
                }

                request(options, function(error, response, body) {
                    if (error) {
                        console.error(KEY, error);

                        res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
                        res.error = error;
                        res.end();
                    }  else if (response.statusCode !== httpStatus.OK) {
                        res.sendStatus(response.statusCode);
                        res.end(body);
                    } else {
                        saveFile(body);
                        sendFile(body);
                    }
                });
            }
        } else {
            res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            res.end();
        }
    });
