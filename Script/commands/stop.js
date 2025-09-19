const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "stop",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
 description: "Show stop",
 commandCategory: "info",
 usages: "intro",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;

  if (!global.clientIntervals || !global.clientIntervals[threadID]) {
    return api.sendMessage("এই চ্যাটে কোন রিপিট চলছে না 🐸", threadID);
  }

  clearInterval(global.clientIntervals[threadID]);
  delete global.clientIntervals[threadID];

  return api.sendMessage("✅ রিপিট বন্ধ করা হলো।", threadID);
};
