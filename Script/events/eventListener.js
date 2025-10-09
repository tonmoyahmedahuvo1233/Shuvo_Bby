const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports = async function ({ api, event }) {
  if (!["log:thread-name", "log:thread-image"].includes(event.logMessageType)) return;

  const threadID = event.threadID;
  const author = event.author;
  const file = path.join(cacheFolder, `${threadID}.json`);

  if (!fs.existsSync(file)) return;
  const lockedData = JSON.parse(fs.readFileSync(file, "utf8"));

  const info = await api.getThreadInfo(threadID);
  const admins = info.adminIDs.map(a => a.id);

  if (!admins.includes(author)) {
    // এডমিন না হলে revert
    if (event.logMessageType === "log:thread-name" && lockedData.name) {
      try {
        await api.setTitle(lockedData.name, threadID);
        api.sendMessage("⚠️ গ্রুপ নাম লক করা আছে! শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
      } catch (e) {
        console.error("Error resetting group name:", e);
      }
    }

    if (event.logMessageType === "log:thread-image" && lockedData.imageSrc) {
      try {
        await api.changeGroupImage(lockedData.imageSrc, threadID);
        api.sendMessage("⚠️ গ্রুপ প্রোফাইল লক করা আছে! শুধু এডমিন পরিবর্তন করতে পারবে।", threadID);
      } catch (e) {
        console.error("Error resetting group image:", e);
      }
    }
  } else {
    // এডমিন হলে নতুন পরিবর্তন সংরক্ষণ
    const newData = {
      imageSrc: info.imageSrc || lockedData.imageSrc,
      name: info.threadName || lockedData.name
    };
    fs.writeFileSync(file, JSON.stringify(newData, null, 2));
  }
};
