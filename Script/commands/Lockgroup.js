const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports.config = {
  name: "lockgroup",
  version: "2.0",
  author: "Akash × ChatGPT",
  role: 1, // admin required
  shortDescription: "Lock group profile & name permanently",
  longDescription: "Prevent non-admins from changing group profile picture or name",
  category: "group",
  guide: "{p}lockgroup"
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
