"use strict";

const jack = require("dnsjack");
const express = require("express");

const SelfReloadJSON = require('self-reload-json');
const settings = new SelfReloadJSON("settings.json");

function initialize(ip) {
    try {
        const server = jack.createServer();

        const dnsIp = process.env.SERVER_ADDRESS || settings.Environment.IpAddress;

        const hosts = [...settings.DNS.Hosts];
        hosts.push(settings.DNS.MainHost);
        settings.save({space: '\t'});
        
        server.route(hosts, function(data, callback) {
            console.log(data.rinfo.address, 'is route', data.domain, dnsIp);
            callback(null, {ip: dnsIp, ttl: 3600});
        });

        server.listen();

        const dnsApp = express();

        dnsApp.use(express.static("public/oforkplayer"));

        const dnsServer = dnsApp.listen(80, ip, function() {
            console.log(`DNS server listening on port ${dnsServer.address().port}`);
        });
    } catch(error) {
        console.error(error);
    }
}
module.exports.initialize = initialize;
