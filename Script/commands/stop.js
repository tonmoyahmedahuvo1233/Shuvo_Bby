module.exports.config = {
  name: "stop",
  version: "1.0.0",
  permission: 0,
  credits: "safe-version",
  description: "Stop the repeating messages",
  category: "fun",
  usages: "/stop",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;

  if (!global.clientIntervals || !global.clientIntervals[threadID]) {
    return api.sendMessage("কোনো রিপিট মেসেজ চলছে না এই চ্যাটে 🐸", threadID);
  }

  clearInterval(global.clientIntervals[threadID]);
  delete global.clientIntervals[threadID];

  return api.sendMessage("✅ রিপিট বন্ধ করা হলো।", threadID);
};
