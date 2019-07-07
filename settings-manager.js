"use strict";

const fs = require("fs");
const path = require("path");

const settingsPath = "./settings.json";
const defaultSettingsPath ="./settings-default.json";

function checkSettings(app, dirname) {
    global.__rootname = path.resolve(dirname);
    global.env = app.get("env");

    if (fs.existsSync(settingsPath)) {
        try {
            let settings = require(settingsPath);
        } catch(errorLoad) {
            console.error(errorLoad);

            try {
                fs.unlinkSync(settingsPath);
            } catch(errorUnlink) {
                console.error(errorUnlink);
            }
        }
    }
    
    if (!fs.existsSync(settingsPath)) {
        if (fs.existsSync(defaultSettingsPath)) {
            var buffer = fs.readFileSync(defaultSettingsPath);
            fs.writeFileSync(settingsPath, buffer);
        }
    }
}
module.exports.checkSettings = checkSettings;