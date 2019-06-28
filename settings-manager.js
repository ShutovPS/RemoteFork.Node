"use strict";

const fs = require("fs");
const settingsPath = "settings.json";
const defaultSettingsPath ="settings-default.json";

function checkSettings() {
    if (!fs.existsSync(settingsPath)) {
        if (fs.existsSync(defaultSettingsPath)) {
            fs.copyFileSync(defaultSettingsPath, settingsPath);
        }
    }
}
module.exports.checkSettings = checkSettings;