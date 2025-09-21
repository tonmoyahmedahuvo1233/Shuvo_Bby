const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "rahat_bot_stop",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘀𝘀",
 description: "Show stop",
 commandCategory: "info",
 usages: "intro",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;

  if (!global.clientIntervals || !global.clientIntervals[threadID]) {
    return api.sendMessage("কাউকে তো চু*দা হচ্ছে না তাহলে rahat_bot_stop বলছো কেন🫩🐸", threadID);
  }

  clearInterval(global.clientIntervals[threadID]);
  delete global.clientIntervals[threadID];

  return api.sendMessage("✅বস থামতে বলছো কেন😑ওকে আরো চুদতে হবে💩", threadID);
};
