"use strict";

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");

const remoteForkIpAddress = () => {
    if (process.env.SERVER_ADDRESS) {
        return process.env.SERVER_ADDRESS;
    }

    if (settings.Environment.UseAutoAddress) {
        return "LOCAL_IP";
    } else {
        return settings.Environment.IpAddress;
    }
}

const remoteForkPort = () => {
    if (process.env.SERVER_PORT) {
        return process.env.SERVER_PORT;
    }

    if (settings.Environment.UseAutoAddress) {
        return "LOCAL_PORT";
    } else {
        return settings.Environment.Port;
    }
}

const remoteForkAddress = () => {
    return `http://${remoteForkIpAddress()}:${remoteForkPort()}`;
}
module.exports.remoteForkAddress = remoteForkAddress();

const aceStreamAddress = () => {
    if (settings.AceStream.UseAutoAddress) {
        return "http://ACE_IP:ACE_PORT";
    } else if (settings.AceStream.UseDifferentAddress) {
        return `http://${settings.AceStream.IpAddress}:${settings.AceStream.Port}`;
    } else {
        return `http://${remoteForkIpAddress()}:${settings.AceStream.Port}`;
    }
}
module.exports.aceStreamAddress = aceStreamAddress();
