"use strict";

const  settings = require("./settings.json");

const remoteForkAddress = () => {
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
