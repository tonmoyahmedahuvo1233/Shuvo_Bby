const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "rep",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
 description: "Show rep",
 commandCategory: "info",
 usages: "intro",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;

  if (!global.clientIntervals) global.clientIntervals = {};

  if (global.clientIntervals[threadID]) {
    return api.sendMessage("এই চ্যাটে রিপিট ইতিমধ্যেই চলছে 🐸\n/stop টাইপ করলে থামবে।", threadID);
  }

  const messages = [
    "হ্যালো সবাই 🌸",
    "কেমন আছো? আশা করি ভালো আছো 😊",
    "আজকের দিনটা সুন্দর হোক 💫",
    "হাসিখুশি থাকো 🐸",
    "পড়াশোনা করতে ভুলো না 📚"
  ];

  let idx = 0;
  await api.sendMessage(messages[idx], threadID);

  const intervalId = setInterval(() => {
    idx = (idx + 1) % messages.length;
    api.sendMessage(messages[idx], threadID);
  }, 10000);

  global.clientIntervals[threadID] = intervalId;
};
