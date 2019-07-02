"use strict";

const request = require("request");

const uniqid = require('uniqid');

const settings = require("./settings.json");

// The following environment variable is set by app.yaml when running on App
// Engine, but will need to be set manually when running locally. See README.md.
const GA_TRACKING_ID = process.env.GA_TRACKING_ID || settings.Environment.GaTrackingId;

const USER_ID = settings.Environment.UserId || uniqid();

settings.Environment.UserId = USER_ID;

function trackEvent(category, action, label, value, userId) {
  const data = {
    // API Version.
    v: '1',
    // Tracking ID / Property ID.
    tid: GA_TRACKING_ID,
    // Anonymous Client Identifier. Ideally, this should be a UUID that
    // is associated with particular user, device, or browser instance.
    cid: userId || USER_ID,
    // Event hit type.
    t: 'event',
    // Event category.
    ec: category,
    // Event action.
    ea: action,
    // Event label.
    el: label,
    // Event value.
    ev: value
  };

  return request.post({
      url: "http://www.google-analytics.com/collect", 
      form: data
  });
}

module.exports.trackEvent = trackEvent;
