"use strict";

const fs = require("fs");
const settingsPath = "./settings.json";
const defaultSettingsPath ="./settings-default.json";

function checkSettings() {
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