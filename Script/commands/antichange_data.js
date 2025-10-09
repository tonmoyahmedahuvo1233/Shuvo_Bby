const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "antichange_data");

module.exports.config = {
    name: "antichange_data",
    version: "1.0.0",
    author: "Rahat × ChatGPT",
    role: 2,
    description: "Show saved anti-change data"
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
