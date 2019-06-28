"use strict";

const KEY = "/plugin_icon";

const request = require("request");
const mime = require("mime-type/with-db");

const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;
module.exports.router = router;

const iconsPath = "public/temp/plugins/";

router.get("/",
    function(req, res) {
        const pluginId = req.query.pluginId;

        if (pluginId != undefined && pluginId.trim()) {
            const filePath = path.join(iconsPath, pluginId + ".png");

            const scriptUrl = "https://img.icons8.com/dusk/384/night-camera.png";

            if (fs.existsSync(filePath)) {
                res.statusCode = 200;
                res.setHeader("Content-type", mime.lookup(filePath));
                fs.createReadStream(filePath).pipe(res);
                return;
            } else {
                const sendFile = (data) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", mime.lookup(filePath));
                    res.end(data);
                }

                const saveFile = (data) => {
                    if (data.length > 0) {
                        if (!fs.existsSync(iconsPath)) {
                            fs.mkdirSync(iconsPath,
                                { recursive: true },
                                (err) => {
                                    if (err) throw err;
                                });
                        }

                        console.log("data", data.length);

                        console.log("filePath", filePath);

                        fs.writeFile(filePath,
                            data,
                            function(err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                    }
                }

                function callback(error, response, body) {
                    console.log("response", response);
                    if (error) {
                        console.error(error);

                        res.error = error;
                        if (response) {
                            res.statusCode = response.statusCode;
                            res.setHeader("Content-Type", response.headers && response.headers["Content-Type"]);
                        } else {
                            res.statusCode = 500;
                        }

                        res.end(body);
                    }
                }

                let options = {
                    url: scriptUrl,
                    encoding: null
                }

                request(options, function(error, response, body) {
                    if (error) {
                        console.error(error);
                        res.end();
                    }  else if (response.statusCode != 200) {
                        res.sendStatus(response.statusCode);
                        res.end(body);
                    } else {
                        saveFile(body);
                        sendFile(body);
                    }
                });
            }
        } else {
            res.end();
        }
    });
