const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports.config = {
    name: "lock",
    version: "1.0.0",
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    hasPermssion: 2,
    description: "Turn off antiout",
    usages: "antiout on/off",
    commandCategory: "system",
    cooldowns: 0
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const info = await api.getThreadInfo(threadID);

  const data = {
    imageSrc: info.imageSrc || null,
    name: info.threadName || null
  };

  const file = path.join(cacheFolder, `${threadID}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  api.sendMessage("✅ গ্রুপ নাম + প্রোফাইল ছবি লক করা হলো। শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
};
