const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "murgi100",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘀𝘀🔰",
  description: "Show murgi",
  commandCategory: "info",
  usages: "murgi100 @mention",
  cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const mentions = Object.keys(event.mentions || {});

  if (mentions.length === 0) {
    return api.sendMessage("𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘀𝘀 কাকে চুদতে চাও😑একবার শুধু mention করো💩ওর চৌদ্দ গুষ্টি চুদে দিব🙂", threadID);
  }

  const targetID = mentions[0];
  const targetName = event.mentions[targetID];

  if (!global.clientIntervals) global.clientIntervals = {};

  if (global.clientIntervals[threadID]) {
    return api.sendMessage("𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘀𝘀 না থামতে বললে থামবো না🫵🏻😎চুদতেই থাকবো", threadID);
  }

  const messages = [
    `হ্যালো ${targetName} 🌸`,
    `${targetName}, কেমন আছো? আশা করি ভালো আছো 😊`,
    `আজকের দিনটা সুন্দর হোক, ${targetName} 💫`,
    `হাসিখুশি থাকো, ${targetName} 🐸`,
    `${targetName}, পড়াশোনা করতে ভুলো না 📚`
  ];

  let idx = 0;
  await api.sendMessage({ body: messages[idx], mentions: [{ tag: targetName, id: targetID }] }, threadID);

  const intervalId = setInterval(() => {
    idx = (idx + 1) % messages.length;
    api.sendMessage({ body: messages[idx], mentions: [{ tag: targetName, id: targetID }] }, threadID);
  }, 5000); // প্রতি 5 সেকেন্ডে মেসেজ যাবে

  global.clientIntervals[threadID] = intervalId;
};

// Stop command (ভুলে গেলে বন্ধ করার জন্য)
module.exports.stop = async function({ api, event }) {
  const threadID = event.threadID;

  if (global.clientIntervals && global.clientIntervals[threadID]) {
    clearInterval(global.clientIntervals[threadID]);
    delete global.clientIntervals[threadID];
    return api.sendMessage("রিপিট বন্ধ করা হয়েছে 🐸", threadID);
  } else {
    return api.sendMessage("এই চ্যাটে কোনো রিপিট চলছে না।", threadID);
  }
};
