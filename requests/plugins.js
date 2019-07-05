"use strict";

const KEY = "/plugins";

const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

module.exports.KEY = KEY;
module.exports.KEYS = [KEY];

module.exports.router = router;

const configs = require("../configs");

const dlna = require("./dlna");

const requestsPath = "./plugins/";
const pluginsPath = "/plugins/";

const plugins = {};

module.exports.Plugins = plugins;

function registerRequest(path) {
    const medule = require(path);

    if (medule.KEY) {
        router.use(medule.KEY, medule.router);
    }
}

function registerRequests(directory) {
    const dirCont = fs.readdirSync( directory );
    const files = dirCont.filter( function( elm ) {
        return elm.endsWith(".js");
    });

    files.forEach(file => {
        try {
            registerRequest(path.join(directory, file));
        } catch(error) {
            console.error(error);
        }
    });
}

function createLink(key) {
    let url = `${configs.remoteForkAddress}${KEY}${key}`;

    return url;
}
module.exports.createLink = createLink;

registerRequests(path.join(__dirname, requestsPath));

function registerPlugin(path) {
    const plugin = require(path);

    if (plugin.Package) {
        if (plugins[plugin.Package.key]) {
            //removeRoute(router, plugin.Package.key);
        }
        router.use(plugin.Package.key, plugin.router);
        plugins[plugin.Package.key] = plugin.Package;
    }
}
module.exports.registerPlugin = registerPlugin;

const directoryPath = path.join(global.__rootname, pluginsPath);

if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true }, err => {
        console.error(KEY, err);
    });
}

const directories = dlna.getDirectories(directoryPath);

directories.forEach(directory => {
    registerPlugin(directory);
});
