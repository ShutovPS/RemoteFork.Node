"use strict";

const KEY = "/install";

const path = require("path");
const request = require("request");
const unzipper = require("unzipper");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;

module.exports.router = router;

const plugins = require("../plugins");

const pluginsPath = "/plugins/";

router.post("/:pluginId", async function(req, res) {
    let data = [];
    req.on("data", chunk => {
        console.log(KEY, req.params.pluginId, chunk.length);
        data.push(chunk);
    });
    req.on("end", async () => {
        await processZip(res, req.params.pluginId, Buffer.concat(data));
    });
});

router.get("/:pluginId", async function(req, res) {
    if (req.query.link) {
        let data;
        try {
            data = await request.get({url: req.query.link, encoding: null});
        } catch(error) {
            console.error(KEY, error);
            res.error = error;
            res.end(error.message);
        }
        if (data) {
            await processZip(res, req.params.pluginId, data);
        }
    } else {
        res.end();
    }
});

async function processZip(res, pluginId, buffer) {
    console.log(KEY, pluginId, buffer.length);

    try {
        const d = await unzipper.Open.buffer(buffer);

        console.log(KEY, "UNZIPPED:", d);
    
        let needRename = true;
        let firstName = undefined;

        const pluginPath = pluginId + "/";

        for (let i in d.files) {
            const file = d.files[i];

            if (!firstName) {
                firstName = file.path;
            }
            if (!file.path.startsWith(firstName)) {
                needRename = false;

                break;
            }
        }

        if (needRename) {
            for (let i in d.files) {
                const file = d.files[i];

                file.path = file.path.replace(firstName, pluginPath);
            }
        }

        let localPath = path.join(global.__rootname, pluginsPath);

        if (!needRename) {
            localPath = path.join(localPath, pluginId);
        }

        const p = await d.extract({path: localPath});
        console.log(KEY, "EXTRACTED:", p);
        
        if (needRename) {
            localPath = path.join(localPath, pluginId);
        }

        plugins.registerPlugin(localPath);

        console.log(KEY, "INSTALLED:", localPath);

        res.end(pluginId);
    } catch(error) {
        console.error(KEY, "processZip", error);

        res.error = error;
        res.end(error.message);
    }
}
