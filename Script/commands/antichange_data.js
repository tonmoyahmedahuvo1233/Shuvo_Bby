const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "antichange_data");

module.exports.config = {
    name: "antichangedata",
    version: "1.0.0",
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    hasPermssion: 2,
    description: "Turn off antijoin",
    usages: "antijoin on/off",
    commandCategory: "system",
    cooldowns: 0
};

module.exports.run = function({ api, event }) {
    const files = fs.readdirSync(dataPath);
    if (files.length === 0) {
        return api.sendMessage("⚠️ No saved anti-change data found.", event.threadID);
    }

    let msg = "📁 Saved Anti-change Groups:\n\n";
    for (const file of files) {
        const id = file.replace(".json", "");
        msg += `• Thread ID: ${id}\n`;
    }

    api.sendMessage(msg, event.threadID);
};
