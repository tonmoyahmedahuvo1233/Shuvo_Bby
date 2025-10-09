const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports = {
  config: {
    name: "lockgroup",
    aliases: ["lockpfp", "lockname"],
    version: "2.0",
    author: "Akash × ChatGPT",
    role: 1, // admin role required
    shortDescription: "Lock group profile & name permanently",
    longDescription: "Prevent non-admins from changing group profile picture or name (auto works after restart)",
    category: "group",
    guide: "{p}lockgroup"
  },

  onStart: async function ({ bot, event }) {
    const threadID = event.threadID;
    const file = path.join(cacheFolder, `${threadID}.json`);

    const info = await bot.getThreadInfo(threadID);
    const data = {
      imageSrc: info.imageSrc || null,
      name: info.threadName || null
    };

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    bot.sendMessage("✅ গ্রুপ নাম + প্রোফাইল ছবি লক করা হলো। শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
  },

  onEvent: async function ({ bot, event }) {
    if (!["log:thread-image", "log:thread-name"].includes(event.logMessageType)) return;

    const threadID = event.threadID;
    const author = event.author;
    const file = path.join(cacheFolder, `${threadID}.json`);

    if (!fs.existsSync(file)) return;
    const lockedData = JSON.parse(fs.readFileSync(file, "utf8"));

    const info = await bot.getThreadInfo(threadID);
    const admins = info.adminIDs.map(e => e.id);

    if (!admins.includes(author)) {
      // এডমিন না হলে
      if (event.logMessageType === "log:thread-image" && lockedData.imageSrc) {
        try {
          await bot.setThreadImage(threadID, lockedData.imageSrc);
          bot.sendMessage("⚠️ গ্রুপ প্রোফাইল লক করা আছে! শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
        } catch (e) {
          console.error("Error resetting group image:", e);
        }
      }

      if (event.logMessageType === "log:thread-name" && lockedData.name) {
        try {
          await bot.setThreadName(threadID, lockedData.name);
          bot.sendMessage("⚠️ গ্রুপ নাম লক করা আছে! শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
        } catch (e) {
          console.error("Error resetting group name:", e);
        }
      }
    } else {
      // এডমিন হলে নতুন পরিবর্তন সংরক্ষণ করো
      const newData = {
        imageSrc: info.imageSrc || lockedData.imageSrc,
        name: info.threadName || lockedData.name
      };
      fs.writeFileSync(file, JSON.stringify(newData, null, 2));
    }
  }
};
