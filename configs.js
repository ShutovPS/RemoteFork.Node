"use strict";

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");

const remoteForkAddress = () => {
    if (process.env.SERVER_ADDRESS && process.env.SERVER_PORT) {
        return `http://${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`;
    }

    if (settings.Environment.UseAutoAddress) {
        return "http://LOCAL_IP:LOCAL_PORT";
    } else {
        return `http://${settings.Environment.IpAddress}:${settings.Environment.Port}`;
    }
}
module.exports.remoteForkAddress = remoteForkAddress();

const aceStreamAddress = () => {
    if (settings.AceStream.UseAutoAddress) {
        return "http://ACE_IP:ACE_PORT";
    } else {
        return `http://${settings.AceStream.IpAddress}:${settings.AceStream.Port}`;
    }
}
module.exports.aceStreamAddress = aceStreamAddress();
